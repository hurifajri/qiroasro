# Task 5: Reference Page — Data Riil

> Menghubungkan Reference page ke data riil dari `master.sql` dan `unused.sql`.

## Status: `[ ]` Belum dimulai

**Depends on:** Task 2 (DB Schema)

---

## Subtasks

### 5.1 Replace Mock Letters Data
- [ ] Replace `MAKHRAJ_GROUPS` mock → fetch real dari `hij_letters` + `hij_articulation_points`
- [ ] Group letters by makhraj area secara dinamis
- [ ] Tambah letter status berdasarkan user progress (jika auth sudah ada)

### 5.2 Articulation Reference Page
- [ ] Buat route `(private)/reference/articulation/page.tsx`
- [ ] Fetch dari `hij_articulation_areas` + `hij_articulation_points`
- [ ] Tampilkan hierarki: Area → Points → Letters
- [ ] Set `available: true` pada `REFERENCE_CATEGORIES` untuk articulation

### 5.3 Trait Reference Page
- [ ] Buat route `(private)/reference/trait/page.tsx`
- [ ] Fetch dari `hij_trait_groups` + `hij_traits`
- [ ] Tampilkan grouped traits (lazimah vs aridhah, opposable pairs)
- [ ] Set `available: true` pada `REFERENCE_CATEGORIES` untuk trait

### 5.4 Tajwid Rule Reference Page
- [ ] Buat route `(private)/reference/rule/page.tsx`
- [ ] Fetch dari `taj_rules` (hierarchical)
- [ ] Tampilkan parent rules → sub-rules
- [ ] Set `available: true` pada `REFERENCE_CATEGORIES` untuk rule

### 5.5 Reference Detail Pages
- [ ] Buat route `(private)/reference/letters/[slug]/page.tsx`
- [ ] Tampilkan detail huruf: makhraj points, sifat, tajwid rules terkait
- [ ] Fetch citations dari `hij_articulation_citations`, `hij_trait_citations`
- [ ] Tampilkan referensi kitab (dari `ref_sources` + `ref_verses`)

### 5.6 Reference Categories — Counts Riil
- [ ] Replace hardcoded counts → dynamic count dari DB
- [ ] Contoh: "32 huruf", "17 titik makhraj", "20 sifat", dll

---

## New Schema Files

> Tidak ada tabel baru, hanya menggunakan data dari `master.sql` + `unused.sql`.

## Files yang Akan Ditambah/Modify

| File | Perubahan |
|---|---|
| `src/app/[locale]/(private)/reference/page.tsx` | Dynamic categories |
| `src/app/[locale]/(private)/reference/letters/page.tsx` | Real data fetch |
| `src/app/[locale]/(private)/reference/articulation/page.tsx` | [NEW] |
| `src/app/[locale]/(private)/reference/trait/page.tsx` | [NEW] |
| `src/app/[locale]/(private)/reference/rule/page.tsx` | [NEW] |
| `src/app/[locale]/(private)/reference/letters/[slug]/page.tsx` | [NEW] Detail |
