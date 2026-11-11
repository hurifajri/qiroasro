# Task 5: Reference Page — Dynamic Route + Kurikulum

> Mengubah reference page ke dynamic `[slug]` route dan menghubungkan ke `CURRICULUM_TOPICS`.

## Status: `[ ]` Belum dimulai

**Depends on:** Task 3 (Curriculum Engine)

---

## Arsitektur

### Dynamic `[slug]/page.tsx`

Semua 24 topik referensi menggunakan 1 file dynamic page, bukan 24 folder terpisah.

```
reference/
├── [slug]/
│   ├── page.tsx              ← 1 file dynamic untuk semua topik
│   └── _contents/
│       ├── noble-quran/
│       │   ├── id.mdx
│       │   └── en.mdx
│       ├── tajweed-science/
│       │   ├── id.mdx
│       │   └── en.mdx
│       └── ... (24 subdirs)
├── _components/
├── letters/                  ← tetap (bukan bagian kurikulum 24 topik)
├── layout.tsx
└── page.tsx                  ← landing page (list categories)
```

**Trade-off:** Dynamic import MDX → runtime error jika file belum ada. Mitigasi: try-catch + `notFound()`.

## Subtasks

### 5.1 Dynamic Reference Route
- [ ] Buat `reference/[slug]/page.tsx` dengan `generateStaticParams`
- [ ] Dynamic MDX import: `import(\`./_contents/${slug}/${locale}.mdx\`)`
- [ ] Validasi slug terhadap `CURRICULUM_TOPICS`
- [ ] Handle missing MDX gracefully → `notFound()`
- [ ] `generateMetadata` dynamic berdasarkan slug

### 5.2 Migrate Existing Content
- [ ] Pindahkan `noble-quran/_contents/` → `[slug]/_contents/noble-quran/`
- [ ] Hapus folder `reference/noble-quran/` (static route)
- [ ] Verifikasi konten tampil sama seperti sebelumnya

### 5.3 Update Landing Page
- [ ] `reference/page.tsx` → import `CURRICULUM_TOPICS`
- [ ] Derive `available` dari user progress (bukan hardcoded boolean)
- [ ] Update `reference/_components/reference.tsx` + `reference-grid.tsx`

### 5.4 Update Sidebar Navigation
- [ ] `reference/_components/reference-sidebar.tsx` → use `CURRICULUM_TOPICS`
- [ ] Active state berdasarkan current `[slug]` param
- [ ] Locked/unlocked visual berdasarkan user progress

---

## Files yang Akan Ditambah/Modify

| File | Perubahan |
|------|-----------|
| `src/app/[locale]/(private)/reference/[slug]/page.tsx` | [NEW] Dynamic route |
| `src/app/[locale]/(private)/reference/[slug]/_contents/` | [NEW] MDX content dirs |
| `src/app/[locale]/(private)/reference/noble-quran/` | [DELETE] Migrated to [slug] |
| `src/app/[locale]/(private)/reference/page.tsx` | Use `CURRICULUM_TOPICS` |
| `src/app/[locale]/(private)/reference/_components/reference.tsx` | Update props |
| `src/app/[locale]/(private)/reference/_components/reference-sidebar.tsx` | Use `CURRICULUM_TOPICS` |
