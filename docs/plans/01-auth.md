# Task 1: Auth & User Management

> Fondasi untuk semua fitur private app. Tanpa auth, tidak bisa track progress, XP, streak, dll.

## Status: `[ ]` Belum dimulai

---

## Konteks

Saat ini private app belum punya sistem auth. Semua page menggunakan mock data. Perlu diputuskan terlebih dahulu:
- Auth provider: **Supabase Auth** (karena sudah pakai Supabase sebagai DB)?
- Social login (Google, Apple)?
- Email/password?

## Subtasks

### 1.1 Pilih & Setup Auth Provider
- [ ] Tentukan auth provider (Supabase Auth / NextAuth / Custom)
- [ ] Setup auth configuration
- [ ] Buat `docs/schemas/auth.sql` untuk tabel users & profiles

### 1.2 Database Schema — Users & Profiles
- [ ] Buat tabel `users` (atau gunakan `auth.users` dari Supabase)
- [ ] Buat tabel `user_profiles` (display name, avatar, username, dll)
- [ ] Buat Drizzle schema di `src/db/schema.ts`
- [ ] Buat Valibot schemas (Remote → Local types)
- [ ] Buat migration SQL di `docs/schemas/auth.sql`

```sql
-- Contoh schema (akan difinalisasi)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    avatar_color_code VARCHAR(30) DEFAULT 'sky',
    locale TEXT DEFAULT 'id',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### 1.3 Auth Middleware & Protected Routes
- [ ] Buat middleware untuk protect `(private)` routes
- [ ] Redirect unauthenticated users ke login page
- [ ] Setup session handling (cookies/JWT)

### 1.4 Login & Register Pages
- [ ] Buat login page (atau modal)
- [ ] Buat register page
- [ ] Integrasi dengan auth provider

### 1.5 User Context & Hooks
- [ ] Buat `useUser` hook untuk akses user data
- [ ] Buat `UserProvider` context
- [ ] Update layout `(private)` untuk wrap dengan `UserProvider`

### 1.6 Connect existing UI to real user
- [ ] Update `@header` dengan user info riil
- [ ] Update `@sidebar` dengan user stats riil
- [ ] Update navigation profile link dengan username riil

---

## Pertanyaan untuk User (Sebelum Mulai)

1. Auth provider apa yang ingin digunakan? (Supabase Auth / NextAuth / lainnya?)
2. Metode login: Email+Password, Social (Google/Apple), atau keduanya?
3. Apakah perlu integrasi dengan waitlist? (waitlist → auto-register?)

---

## New Schema Files

| File | Deskripsi |
|---|---|
| `docs/schemas/auth.sql` | `user_profiles` table + RLS policies |

## Files yang Akan Di-modify

| File | Perubahan |
|---|---|
| `src/db/schema.ts` | Tambah `userProfiles` table |
| `src/app/[locale]/(private)/layout.tsx` | Wrap dengan `UserProvider` |
| `src/app/[locale]/(private)/_components/private.tsx` | Pass real user data |
| `next.config.ts` (atau middleware) | Auth middleware |
