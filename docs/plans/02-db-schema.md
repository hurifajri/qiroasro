# Task 2: Drizzle Schema & DB Layer

> Menambahkan semua tabel dari `master.sql` dan `unused.sql` ke Drizzle ORM, plus tabel baru untuk progress tracking.

## Status: `[ ]` Belum dimulai

---

## Konteks

Saat ini `src/db/schema.ts` hanya punya:
- `waitlist` table
- `mvPlaygroundData` materialized view

Perlu ditambahkan:
1. Tabel dari `master.sql` (agar bisa diakses dari private app via Drizzle)
2. Tabel dari `unused.sql` (tajwid rules, citations, references)
3. Tabel baru untuk curriculum & gamification

## Subtasks

### 2.1 Tambah Tabel `master.sql` ke Drizzle
- [ ] `hij_letters`
- [ ] `hij_articulation_areas`
- [ ] `hij_articulation_points`
- [ ] `hij_letter_articulations`
- [ ] `hij_trait_groups`
- [ ] `hij_traits`
- [ ] `hij_letter_traits`
- [ ] Buat service global `src/services/hijaiyyah.ts` (server action)
- [ ] Buat Valibot schemas di `src/schemas/hijaiyyah.ts`
- [ ] Buat transformer di `src/models/hijaiyyah.ts`

### 2.2 Tambah Tabel `unused.sql` ke Drizzle
- [ ] `ref_sources`
- [ ] `ref_verses`
- [ ] `taj_rules`
- [ ] `taj_rule_definitions` (perlu finalisasi `rule_category` enum)
- [ ] `taj_rule_citations`
- [ ] `hij_articulation_citations`
- [ ] `hij_trait_citations`
- [ ] Buat Valibot schemas di `src/schemas/tajwid.ts` dan `src/schemas/reference.ts`
- [ ] Buat transformer di `src/models/tajwid.ts` dan `src/models/reference.ts`

### 2.3 Pecah schema.ts jika terlalu panjang
- [ ] Evaluasi apakah perlu split `src/db/schema.ts` menjadi:
  - `src/db/schema/waitlist.ts`
  - `src/db/schema/hijaiyyah.ts`
  - `src/db/schema/tajwid.ts`
  - `src/db/schema/reference.ts`
  - `src/db/schema/index.ts` (re-export semua)

### 2.4 Finalisasi `rule_category` ENUM
- [ ] Tentukan list final `rule_category` values
- [ ] Buat migration SQL
- [ ] Tambahkan ke `docs/schemas/unused.sql` (update) atau buat file baru

### 2.5 Verify Data Integrity
- [ ] Pastikan seed data (`seed.letters.sql`, `seed.articulations.sql`, `seed.traits.sql`) compatible
- [ ] Test query via Drizzle matches raw SQL

---

## New Schema Files

> Tidak ada tabel DB baru di task ini, hanya menambahkan existing tables ke Drizzle ORM.

## Files yang Akan Ditambah/Modify

| File | Perubahan |
|---|---|
| `src/db/schema.ts` | Tambah semua tabel dari `master.sql` + `unused.sql` |
| `src/schemas/hijaiyyah.ts` | [NEW] Valibot schemas untuk letters, articulations, traits |
| `src/schemas/tajwid.ts` | [NEW] Valibot schemas untuk tajwid rules |
| `src/schemas/reference.ts` | [NEW] Valibot schemas untuk ref sources & verses |
| `src/models/hijaiyyah.ts` | [NEW] Transformers |
| `src/models/tajwid.ts` | [NEW] Transformers |
| `src/models/reference.ts` | [NEW] Transformers |
| `src/services/hijaiyyah.ts` | [NEW] Server actions untuk fetch hijaiyyah data |
