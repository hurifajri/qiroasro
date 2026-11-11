# Task 3: Curriculum Engine

> Sistem kurikulum terpadu: satu sumber data (`CURRICULUM_TOPICS`) untuk reference, sections, dan learn pages + progress tracking di DB.

## Status: `[x]` Selesai

**Depends on:** Task 1 (Auth), Task 2 (DB Schema)

---

## Arsitektur

### Sumber Data Tunggal (Application-Level)

Semua definisi kurikulum disimpan di **file TypeScript**, bukan di database:

```
CURRICULUM_TOPICS[]              ← Single source of truth
├── slug, sortOrder, iconSymbol
├── titleKey, subtitleKey        ← Reference page
├── sectionTitleKey, sectionDescriptionKey  ← Sections page
└── units[]                      ← Learn page
    ├── slug, titleKey, descriptionKey
    ├── colorCode, iconKey
    └── lessons[]
        ├── type: 'quiz' | 'trophy'
        └── quizSource?: 'relational' | 'authored'
```

**24 topik = 24 section = 24 reference categories (1:1 mapping)**

| Data | Disimpan di | Alasan |
|------|-------------|--------|
| Definisi kurikulum (topik, unit, lesson) | TS file | Statis, jarang berubah, developer-managed |
| Konten reference | MDX files | Konten long-form, per-locale |
| Konten quiz (authored) | TS file + i18n JSON | Statis, git-tracked, ~480 pertanyaan |
| User progress | DB (PostgreSQL) | Per-user, dinamis, butuh persistence |

### Lesson Structure

Setiap unit memiliki **2 lessons (fixed)**:

| # | Tipe | Deskripsi |
|---|------|-----------|
| 1 | `quiz` | Sesi kuis (5 pertanyaan) |
| 2 | `trophy` | Penanda unit selesai + XP reward |

> Expandable: Practice Review dan Chest bisa ditambahkan nanti tanpa breaking changes.

### Quiz Content — Hybrid Approach

| Kategori | Quiz Source | Contoh Topik |
|----------|------------|--------------|
| Topik huruf hijaiyyah | `relational` — random dari `hij_*` tables | articulation-points, letter-characteristics |
| Topik non-huruf | `authored` — pre-defined di TS + i18n | noble-quran, mad-rules, waqf-ibtida |

## Subtasks

### 3.1 Unified Curriculum Definition
- [x] Rewrite `src/app/[locale]/(private)/_lib/curriculum.ts` → `CURRICULUM_TOPICS[]`
- [x] Definisikan 24 topik + units (dari h2 MDX) + lessons
- [ ] Hapus `MOCK_SECTIONS` di `sections/_lib/mock-data.ts` ← saat wiring selesai
- [ ] Hapus `MOCK_UNITS` + `MOCK_LESSONS` di `learn/_lib/mock-data.ts` ← saat wiring selesai

### 3.2 Authored Quiz Content
- [x] `src/app/[locale]/(private)/_lib/quiz-content/types.ts`
- [x] Quiz content noble-quran: `quiz-content/noble-quran.ts` (4 units × 5 pertanyaan)
- [x] `quiz-content/index.ts` — registry topicSlug → content
- [x] i18n quiz namespace: `src/i18n/locales/{locale}/quiz.json` (5 locale)

### 3.3 DB Progress Tracking
- [x] `src/db/curriculum-schema.ts`: 3 tabel progress (section, unit, lesson)
- [x] `drizzle.config.ts` — tambah schema
- [x] `src/lib/db.ts` — import schema baru
- [ ] Generate + run migration (pending live DB connection)

### 3.4 Services & Queries
- [x] `_services/curriculum-progress.ts`: `getSectionsWithProgress`, `getUnitsWithProgress`, `completeLessonAction` (cascading completion)
- [x] `_queries/curriculum-progress.ts` — TanStack Query options
- [x] `_schemas/curriculum-progress.ts` — Valibot schemas

### 3.5 Unlocking Logic
- [x] Complete semua lessons di unit → unlock next unit (via `completeLessonAction` cascade)
- [x] Complete semua units di section → unlock next section
- [x] Section 1 + reference topik 1 → available by default (sortOrder === 1 logic)

---

## DB Schema — Progress Tracking

```sql
CREATE TABLE user_section_progress (
    user_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    topic_slug VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'locked',
    -- CHECK (status IN ('locked', 'available', 'in-progress', 'completed'))
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, topic_slug)
);

CREATE TABLE user_unit_progress (
    user_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    topic_slug VARCHAR(50) NOT NULL,
    unit_slug VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'locked',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, topic_slug, unit_slug)
);

CREATE TABLE user_lesson_progress (
    user_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    topic_slug VARCHAR(50) NOT NULL,
    unit_slug VARCHAR(50) NOT NULL,
    lesson_order INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'locked',
    score INT NOT NULL DEFAULT 0,  -- 0-5 crowns
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, topic_slug, unit_slug, lesson_order)
);
```

---

## Files yang Akan Ditambah/Modify

| File | Status | Perubahan |
|------|--------|-----------|
| `src/app/[locale]/(private)/_lib/curriculum.ts` | REWRITE | `CURRICULUM_TOPICS[]` unified definition |
| `src/app/[locale]/(private)/_lib/quiz-content/` | [NEW] | Authored quiz content per topik |
| `src/db/curriculum-schema.ts` | [NEW] | 3 progress tracking tables |
| `src/app/[locale]/(private)/_services/curriculum-progress.ts` | [NEW] | Server actions |
| `src/app/[locale]/(private)/_queries/curriculum-progress.ts` | [NEW] | TanStack Query options |
| `src/app/[locale]/(private)/_schemas/curriculum-progress.ts` | [NEW] | Valibot schemas |
| `src/app/[locale]/(private)/sections/_lib/mock-data.ts` | [DELETE] | Replaced |
| `src/app/[locale]/(private)/learn/_lib/mock-data.ts` | [DELETE] | Replaced |
