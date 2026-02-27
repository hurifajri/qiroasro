# Task 6: Practice Page — Quiz Engine

> Menghubungkan Practice page ke shared quiz engine dengan data riil.

## Status: `[ ]` Belum dimulai

**Depends on:** Task 3 (Curriculum), Task 4 (Learn — shared quiz engine)

---

## Subtasks

### 6.1 Articulation Practice Mode
- [ ] Buat route `(private)/practice/articulation/page.tsx`
- [ ] Quiz: "Huruf ini keluar dari makhraj mana?"
- [ ] Generate soal dari `hij_letter_articulations` + `hij_articulation_points`
- [ ] Gunakan shared quiz engine (`src/lib/quiz/`)

### 6.2 Trait Practice Mode
- [ ] Buat route `(private)/practice/trait/page.tsx`
- [ ] Quiz: "Huruf ini memiliki sifat apa?"
- [ ] Generate soal dari `hij_letter_traits` + `hij_traits`

### 6.3 Rule Practice Mode
- [ ] Buat route `(private)/practice/rule/page.tsx`
- [ ] Quiz: identify tajwid rules dari contoh bacaan
- [ ] Generate soal dari `taj_rules` + `taj_rule_definitions`

### 6.4 Listen Practice Mode (Future)
- [ ] Placeholder — membutuhkan audio assets
- [ ] Akan diimplementasi setelah audio tersedia

### 6.5 Mistakes Practice
- [ ] Track jawaban salah user di DB
- [ ] Tampilkan soal-soal yang pernah dijawab salah
- [ ] Buat tabel `usr_mistake_log` di `docs/schemas/gamification.sql`

### 6.6 Saved Practice
- [ ] Fitur bookmark soal/huruf favorit
- [ ] Buat tabel `usr_saved_items` di `docs/schemas/gamification.sql`

### 6.7 Practice Results & XP
- [ ] Submit hasil practice ke server
- [ ] Award XP berdasarkan accuracy
- [ ] Update streak jika applicable

---

## Files yang Akan Ditambah/Modify

| File | Perubahan |
|---|---|
| `src/app/[locale]/(private)/practice/articulation/page.tsx` | [NEW] |
| `src/app/[locale]/(private)/practice/trait/page.tsx` | [NEW] |
| `src/app/[locale]/(private)/practice/rule/page.tsx` | [NEW] |
| `src/app/[locale]/(private)/practice/page.tsx` | Dynamic practice modes |
