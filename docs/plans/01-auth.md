# Task 1: Auth & User Management

> Fondasi untuk semua fitur private app. Tanpa auth, tidak bisa track progress, XP, streak, dll.

## Status: `[ ]` Belum dimulai

---

## Keputusan

| Keputusan | Jawaban |
|---|---|
| Auth provider | **Supabase Auth** (+ abstraction layer untuk minimize vendor lock-in) |
| Metode login | **Social auth only** — Google (wajib), Apple (opsional, wajib jika publish ke App Store) |
| Email+Password | ❌ Tidak untuk saat ini (bisa ditambah nanti) |
| Waitlist integration | ❌ Tidak perlu — waitlist tetap standalone untuk broadcast email |

### Vendor Lock-in Strategy

Menggunakan abstraction layer agar mudah ganti provider di masa depan:

```
src/
├── lib/
│   └── auth.ts              ← Public API (wrapper, provider-agnostic)
├── services/
│   └── auth-provider.ts     ← Supabase-specific implementation
```

Jika suatu hari perlu migrasi dari Supabase Auth ke NextAuth/Better Auth/dll, cukup ganti `auth-provider.ts` tanpa ubah semua komponen.

---

## Subtasks

### 1.1 Setup Supabase Auth
- [ ] Enable Google OAuth di Supabase Dashboard
- [ ] Setup Google Cloud Console (OAuth credentials)
- [ ] Install `@supabase/ssr` untuk Next.js App Router
- [ ] Buat Supabase client helpers (browser + server)

### 1.2 Auth Abstraction Layer
- [ ] Buat `src/lib/auth.ts` — provider-agnostic wrapper
  - `signIn(provider)` — trigger social login
  - `signOut()` — logout
  - `getUser()` — get current user (server-side)
  - `getSession()` — get current session
- [ ] Buat `src/services/auth-provider.ts` — Supabase-specific implementation

### 1.3 Database Schema — User Profiles
- [ ] Buat `docs/schemas/auth.sql`
- [ ] Tabel `user_profiles` (references `auth.users` dari Supabase)
- [ ] Buat Drizzle schema di `src/db/schema.ts`
- [ ] Buat Valibot schemas (Remote → Local types)

```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    avatar_color_code VARCHAR(30) DEFAULT 'sky',
    locale TEXT DEFAULT 'id',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Auto-create profile on signup via trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'preferred_username', 'user-' || LEFT(NEW.id::text, 8)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 1.4 Auth Middleware & Protected Routes
- [ ] Buat Next.js middleware untuk protect `(private)` routes
- [ ] Redirect unauthenticated users ke landing page / login
- [ ] Setup session refresh di middleware

### 1.5 Login UI
- [ ] Buat login page / modal (dengan tombol "Sign in with Google")
- [ ] Buat callback route untuk OAuth redirect
- [ ] Handle auth errors (popup blocked, cancelled, dll)

### 1.6 User Context & Hooks
- [ ] Buat `useUser` hook untuk akses user data di client
- [ ] Buat `UserProvider` context
- [ ] Update layout `(private)` untuk wrap dengan `UserProvider`

### 1.7 Connect Existing UI to Real User
- [ ] Update `@header` dengan user info riil
- [ ] Update `@sidebar` dengan user info riil
- [ ] Update navigation profile link dengan username riil

---

## New Schema Files

| File | Deskripsi |
|---|---|
| `docs/schemas/auth.sql` | `user_profiles` table + trigger + RLS policies |

## Files yang Akan Ditambah/Modify

| File | Perubahan |
|---|---|
| `src/lib/auth.ts` | [NEW] Auth abstraction layer |
| `src/services/auth-provider.ts` | [NEW] Supabase Auth implementation |
| `src/db/schema.ts` | Tambah `userProfiles` table |
| `src/app/[locale]/(private)/layout.tsx` | Wrap dengan `UserProvider` |
| `src/app/[locale]/(private)/_components/private.tsx` | Pass real user data |
| `src/middleware.ts` | [NEW/MODIFY] Auth middleware |
