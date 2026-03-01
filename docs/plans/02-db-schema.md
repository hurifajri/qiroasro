# Task 2: Drizzle Schema & DB Layer

> Menambahkan semua tabel dari `master.sql` dan `unused.sql` ke Drizzle ORM, plus tabel baru untuk progress tracking.

## Status: `[/]` Partial — master tables + schema split done, sisa: unused.sql tables + services/schemas/models

---

## Konteks

Schema sudah dipecah ke 4 file di `src/db/`:

| File | Domain | Status |
|------|--------|--------|
| `auth-schema.ts` | Better Auth tables (user, session, account, verification) — managed by Better Auth | ✅ Done |
| `common-schema.ts` | Master data (hij_*) + waitlist — shared, public read | ✅ Done |
| `playground-schema.ts` | `mv_playground_data` materialized view | ✅ Done |
| `user-schema.ts` | Private-app user data (`userProfiles`) | ✅ Done (Task 1.5) |

Config files sudah di-update:
- `drizzle.config.ts` — schema array (4 files: auth, common, playground, user)
- `src/lib/db.ts` — spread 4 schema ke satu object

## Subtasks

### 2.1 Tambah Tabel `master.sql` ke Drizzle — ✅ Done

Semua 7 tabel sudah ada di `src/db/common-schema.ts` dengan field, tipe data, relations, dan indexes yang match persis dengan `docs/schemas/master.sql`:

- [x] `hij_letters`
- [x] `hij_articulation_areas`
- [x] `hij_articulation_points`
- [x] `hij_letter_articulations`
- [x] `hij_trait_groups`
- [x] `hij_traits`
- [x] `hij_letter_traits`
- [ ] Buat service global `src/services/hijaiyyah.ts` (server action)
- [ ] Buat Valibot schemas di `src/schemas/hijaiyyah.ts`
- [ ] Buat transformer di `src/models/hijaiyyah.ts`

### 2.2 Tambah Tabel `unused.sql` ke Drizzle — ⏸️ Deferred

> [!WARNING]
> `unused.sql` belum siap untuk dikonversi ke Drizzle. Ada 2 issues:
> 1. `rule_category` ENUM masih **commented out** — `taj_rule_definitions.trigger_category` depends on it
> 2. Performance indexes (line 212-213) reference kolom `category` yang **tidak ada** di `hij_letters` maupun `hij_traits`
>
> Perlu finalisasi ENUM dan fix invalid indexes dulu sebelum lanjut.

- [ ] `ref_sources`
- [ ] `ref_verses`
- [ ] `taj_rules`
- [ ] `taj_rule_definitions` (blocked: perlu finalisasi `rule_category` enum)
- [ ] `taj_rule_citations`
- [ ] `hij_articulation_citations`
- [ ] `hij_trait_citations`
- [ ] Buat Valibot schemas di `src/schemas/tajwid.ts` dan `src/schemas/reference.ts`
- [ ] Buat transformer di `src/models/tajwid.ts` dan `src/models/reference.ts`

### 2.3 Pecah schema — ✅ Done

Schema sudah dipecah ke file terpisah (bukan monolithic `schema.ts`):
- [x] `src/db/auth-schema.ts` — auth tables
- [x] `src/db/common-schema.ts` — master data + waitlist
- [x] `src/db/playground-schema.ts` — materialized view
- [x] `src/db/user-schema.ts` — user profiles ✅ Done

### 2.4 Finalisasi `rule_category` ENUM
- [ ] Tentukan list final `rule_category` values
- [ ] Update `docs/schemas/unused.sql` — uncomment + fix ENUM
- [ ] Fix invalid performance indexes (remove `category` column references)

### 2.5 Verify Data Integrity
- [x] Seed data compatible (master tables sudah live di DB)
- [ ] Test query via Drizzle matches raw SQL (akan diverifikasi saat buat services)

---

## Files yang Akan Ditambah/Modify

| File | Status | Perubahan |
|------|--------|-----------|
| `src/db/common-schema.ts` | ✅ Done | Semua tabel `master.sql` + waitlist |
| `src/db/auth-schema.ts` | ✅ Done | Auth tables (Better Auth managed) |
| `src/db/playground-schema.ts` | ✅ Done | MV playground data |
| `src/db/user-schema.ts` | ✅ Done | [NEW] User profiles (Task 1.5) |
| `src/schemas/hijaiyyah.ts` | [ ] | [NEW] Valibot schemas untuk letters, articulations, traits |
| `src/schemas/tajwid.ts` | [ ] | [NEW] Valibot schemas untuk tajwid rules (blocked: unused.sql) |
| `src/schemas/reference.ts` | [ ] | [NEW] Valibot schemas untuk ref sources & verses (blocked: unused.sql) |
| `src/models/hijaiyyah.ts` | [ ] | [NEW] Transformers |
| `src/models/tajwid.ts` | [ ] | [NEW] Transformers (blocked: unused.sql) |
| `src/models/reference.ts` | [ ] | [NEW] Transformers (blocked: unused.sql) |
| `src/services/hijaiyyah.ts` | [ ] | [NEW] Server actions untuk fetch hijaiyyah data |
