# Task 11: Split i18n per Namespace

> Memecah monolithic locale JSON menjadi 3 namespace: `global.json`, `page.json`, `quiz.json`.

## Status: `[x]` Selesai

**Depends on:** Tidak ada (sebaiknya dikerjakan sebelum Task 3)

---

## Konteks

File i18n saat ini monolithic (`id.json` = 1094 baris). Dengan penambahan konten quiz, file akan membengkak. Solusi: split jadi 3 file per locale.

### Mapping dari Monolithic ke Split

| Object di JSON lama | File baru | Alasan |
|---|---|---|
| `global` | `global.json` | UI text global (nav, badges, letters, traits, dll) |
| `home_page`, `playground_page`, `learn_page`, `sections_page`, `reference_page`, `reference_letters_page`, `practice_page`, `leaderboard_page`, `quests_page`, `shop_page`, `profile_page`, `settings_page`, `auth_page` | `page.json` | Semua page-specific text |
| *(baru)* `quiz_content` | `quiz.json` | Quiz questions/answers — akan bertumbuh |

### Struktur Baru

```
src/i18n/locales/
├── id/
│   ├── global.json     ← global object
│   ├── page.json       ← semua *_page objects
│   └── quiz.json       ← quiz questions/answers
├── en/
│   ├── global.json
│   ├── page.json
│   └── quiz.json
├── ar/   ← idem
├── tr/   ← idem
└── ms/   ← idem
```

> [!IMPORTANT]
> **Semua key harus dalam bahasa Inggris** — universal di semua locale, hanya value yang berbeda per bahasa.

## Subtasks

### 11.1 Restructure Locale Files
- [x] Buat folder per locale: `locales/id/`, `locales/en/`, `locales/ar/`, `locales/tr/`, `locales/ms/`
- [x] Extract `global` object → `{locale}/global.json` (5 files)
- [x] Extract semua `*_page` objects → `{locale}/page.json` (5 files)
- [x] Buat `{locale}/quiz.json` (5 files, dengan noble-quran quiz content)
- [x] Hapus file lama (`id.json`, `en.json`, dsb.)

### 11.2 Update i18n Config
- [x] Update `src/i18n/request.ts` → merge 3 JSON files per locale
- [x] Verifikasi semua existing translations masih berfungsi (pnpm check:types pass)

### 11.3 Quiz Namespace — Konten
- [x] Isi `quiz.json` untuk noble-quran (5 locale, 4 units × 5 pertanyaan)
- [x] Semua key dalam bahasa Inggris

---

## Files yang Akan Ditambah/Modify

| File | Perubahan |
|------|-----------|
| `src/i18n/request.ts` | Update import → merge 3 namespaces |
| `src/i18n/locales/{locale}/global.json` | [NEW] Dari `global` object |
| `src/i18n/locales/{locale}/page.json` | [NEW] Dari semua `*_page` objects |
| `src/i18n/locales/{locale}/quiz.json` | [NEW] Quiz content |
| `src/i18n/locales/{locale}.json` | [DELETE] Replaced by folder |
