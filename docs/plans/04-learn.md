# Task 4: Learn Page — Fungsionalitas

> Menghubungkan Learn page ke `CURRICULUM_TOPICS` dan user progress dari DB.

## Status: `[/]` Sebagian selesai (4.1 & 4.4 done, 4.2 & 4.3 pending)

**Depends on:** Task 3 (Curriculum Engine)

---

## Konteks

Learn page menampilkan **units dari section yang sedang aktif** dalam tampilan zig-zag Duolingo-style. Saat ini menggunakan mock data (`MOCK_UNITS`, `MOCK_LESSONS`). Akan diganti dengan data dari `CURRICULUM_TOPICS` + user progress DB.

### Lesson Flow

```
User buka Learn Page
  → Load section aktif dari progress DB
  → Render units dari CURRICULUM_TOPICS[activeSection].units
  → Render lessons per unit (Quiz + Trophy buttons)
  → User klik Quiz button
  → Masuk ke halaman kuis (5 pertanyaan)
  → Submit hasil → update progress DB → unlock next
```

## Subtasks

### 4.1 Replace Mock Data dengan Real Data
- [x] Replace `MOCK_UNITS` → derive dari `CURRICULUM_TOPICS[activeSection].units`
- [x] Replace `MOCK_LESSONS` → derive dari unit.lessons (type + order)
- [x] `learn.tsx` reads `?section=` URL param, defaults ke first topic
- [x] `sections/page.tsx` prefetches via TanStack `useSuspenseQuery`

### 4.2 Lesson Quiz Page
- [ ] Buat route `(private)/learn/quiz/page.tsx` (atau modal)
- [ ] Params: `topicSlug`, `unitSlug`, `lessonOrder`
- [ ] Determine quiz source dari curriculum definition (`relational` vs `authored`)
- [ ] Untuk `relational`: reuse quiz-generator dari playground
- [ ] Untuk `authored`: load dari quiz-content TS + i18n namespace

### 4.3 Lesson Completion Flow
- [ ] Submit hasil → `completeLesson(userId, topicSlug, unitSlug, lessonOrder, score)`
- [ ] Auto-unlock next lesson / unit / section
- [ ] Tampilkan celebration + XP earned
- [ ] Update progress state (invalidate TanStack Query)

### 4.4 Section Navigation
- [x] Learn page reads `?section=topicSlug` URL param
- [x] Sections component `handleContinue` pushes `?section={slug}` to router
- [x] `handleBack()` links ke `/sections` dari Learn

---

## Catatan: Reuse Quiz Engine

Quiz engine di playground (`_hooks/use-quiz-generator.ts`, `_lib/quiz-generator.ts`, `_lib/quiz-checker.ts`) bisa di-refactor ke global level (`src/lib/quiz/`) saat dibutuhkan oleh learn page:
- Playground quiz (existing) — relational
- Learn lesson quiz (baru) — relational + authored
- Practice page quiz (nanti) — relational + authored

## Files yang Akan Ditambah/Modify

| File | Perubahan |
|------|-----------|
| `src/app/[locale]/(private)/learn/page.tsx` | Fetch real data, hapus mock import |
| `src/app/[locale]/(private)/learn/_components/learn.tsx` | Terima server data |
| `src/app/[locale]/(private)/learn/_lib/mock-data.ts` | [DELETE] |
| `src/app/[locale]/(private)/learn/quiz/page.tsx` | [NEW] Quiz session page |
