# Task 4: Learn Page — Fungsionalitas

> Menghubungkan Learn page ke data riil dan menambahkan lesson flow.

## Status: `[ ]` Belum dimulai

**Depends on:** Task 3 (Curriculum Engine)

---

## Subtasks

### 4.1 Replace Mock Data dengan Real Data
- [ ] Replace `MOCK_UNITS` → fetch dari `getSections` + `getUnits` services
- [ ] Replace `MOCK_LESSONS` → fetch dari `getLessons` service
- [ ] Update `Learn` component untuk terima server data via props
- [ ] Tambah loading states + error handling

### 4.2 Lesson Detail Page
- [ ] Buat route `(private)/learn/lesson/[lessonId]/page.tsx`
- [ ] Tampilkan info huruf: symbol, nama, makhraj, sifat (dari `master.sql`)
- [ ] Tampilkan audio pronunciation (jika ada)

### 4.3 Lesson Quiz Flow
- [ ] Buat quiz engine untuk lesson (bisa reuse logic dari playground quiz)
- [ ] Tipe soal:
  - Pilih huruf yang benar dari symbol
  - Pilih makhraj yang benar
  - Pilih sifat yang benar
  - Pasangkan huruf dengan makhraj
- [ ] Generate questions dari `hij_letter_articulations` dan `hij_letter_traits`
- [ ] Tampilkan hasil + XP earned + crowns

### 4.4 Lesson Completion Flow
- [ ] Submit hasil lesson ke server → `completeLesson(userId, lessonId, crowns)`
- [ ] Unlock next lesson / unit / section otomatis
- [ ] Tampilkan celebration animation
- [ ] Update XP dan hearts di sidebar

### 4.5 Hearts System Integration
- [ ] Cek hearts sebelum mulai lesson
- [ ] Kurangi heart saat jawab salah
- [ ] Jika hearts habis → tampilkan "Out of hearts" dialog
- [ ] Link ke shop untuk refill

### 4.6 Section Completion
- [ ] Tampilkan section summary saat semua units selesai
- [ ] Unlock next section badge

---

## Catatan: Reuse dari Playground

Quiz engine di playground (`_hooks/use-quiz-generator.ts`, `_lib/quiz-generator.ts`, `_lib/quiz-checker.ts`) bisa di-refactor ke global level (`src/lib/quiz/`) agar bisa digunakan di:
- Playground quiz (existing)
- Learn lesson quiz (baru)
- Practice page quiz (nanti)

## Files yang Akan Ditambah/Modify

| File | Perubahan |
|---|---|
| `src/app/[locale]/(private)/learn/page.tsx` | Fetch real data, hapus mock import |
| `src/app/[locale]/(private)/learn/_components/learn.tsx` | Terima server data |
| `src/app/[locale]/(private)/learn/lesson/[lessonId]/page.tsx` | [NEW] Lesson detail + quiz |
| `src/app/[locale]/(private)/learn/_queries/` | [NEW] TanStack Query options |
| `src/lib/quiz/` | [NEW] Shared quiz engine (refactor dari playground) |
