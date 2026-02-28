# Task 1: Auth & User Management

> Fondasi untuk semua fitur private app. Tanpa auth, tidak bisa track progress, XP, streak, dll.

## Status: `[ ]` Belum Dikerjakan

---

## Keputusan

| Keputusan | Jawaban |
|---|---|
| Auth provider | **Better Auth** — TypeScript-first, framework-agnostic, Drizzle adapter built-in |
| Metode login | **Social auth only** — Google (wajib), Apple (opsional, wajib jika publish ke App Store) |
| Email+Password | ❌ Tidak untuk saat ini (bisa ditambah nanti via plugin) |
| Waitlist integration | ❌ Tidak perlu — waitlist tetap standalone untuk broadcast email |
| DB queries | **Drizzle ORM** (existing) — Better Auth pakai Drizzle adapter langsung |

### Packages yang Digunakan

| Package | Install? | Fungsi |
|---|---|---|
| `better-auth` | ✅ Ya | Core auth framework — server config, client, plugins, adapters |

```bash
# Yang perlu di-install
pnpm add better-auth
```

> [!NOTE]
> Better Auth sudah include Drizzle adapter, social OAuth, session management, dan CSRF protection. Tidak perlu tambahan package untuk fitur dasar. Plugin tambahan (2FA, organization, dll.) diimport langsung dari `better-auth/plugins`.

### Arsitektur: Auth

```
┌─────────────────────────────────────────────────────┐
│ src/lib/                                            │
│                                                     │
│ auth.ts            ──→ Better Auth server config    │ ← Server config + Drizzle adapter
│ auth-client.ts     ──→ Better Auth React client     │ ← Client hooks (signIn, useSession)
│ db.ts              ──→ drizzle-orm + postgres       │ ← All DB queries
└─────────────────────────────────────────────────────┘

Route Handler:
  src/app/api/auth/[...all]/route.ts ──→ toNextJsHandler(auth)
```

**Session management:** Better Auth mengelola tabel `session`, `user`, `account`, dan `verification` sendiri. Tidak perlu manage session cookies manual.

**Authorization:** Handle di service layer (explicit `userId` filter di setiap query). Portable — tidak terikat ke provider tertentu.

---

## Subtasks

### 1.1 Setup Better Auth

- [ ] Install package: `pnpm add better-auth`
- [ ] Uninstall Supabase packages: `pnpm remove @supabase/supabase-js @supabase/ssr`
- [ ] Tambah env vars: `BETTER_AUTH_SECRET` (32+ chars), `BETTER_AUTH_URL`
- [ ] Update `src/env.ts` — hapus Supabase env vars, tambah Better Auth env vars
- [ ] Buat `src/lib/auth.ts` — Better Auth server config:
  - Drizzle adapter (`drizzleAdapter`)
  - Social providers (Google)
  - Session config (expiry, cookie cache)
  - Rate limiting
- [ ] Buat `src/lib/auth-client.ts` — Better Auth React client:
  - Import dari `better-auth/react`
  - Export `signIn`, `signOut`, `useSession`

### 1.2 Route Handler

- [ ] Buat `src/app/api/auth/[...all]/route.ts` — `toNextJsHandler(auth)` → export `{ GET, POST }`
- [ ] Hapus `src/app/api/auth/callback/route.ts` (Supabase OAuth callback — tidak diperlukan lagi)

### 1.3 Database Schema (Auth Tables)

- [ ] Generate auth schema via Better Auth CLI: `npx @better-auth/cli@latest generate --output src/db/auth-schema.ts`
- [ ] Jalankan migration via Drizzle: `pnpm drizzle-kit push`
- [ ] Update `docs/schemas/auth.sql` — dokumentasi tabel Better Auth (`user`, `session`, `account`, `verification`)

> [!NOTE]
> Better Auth membuat tabel `user`, `session`, `account`, dan `verification` sendiri. Tidak perlu trigger `handle_new_user()` atau referensi ke `auth.users` seperti di Supabase.

### 1.4 Google OAuth

- [ ] Configure `socialProviders.google` di `src/lib/auth.ts`:
  - `clientId`: dari Google Cloud Console
  - `clientSecret`: dari Google Cloud Console
- [ ] Update env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (ganti dari `SUPABASE_AUTH_EXTERNAL_GOOGLE_*`)
- [ ] Verifikasi redirect URI di Google Cloud Console: `{BETTER_AUTH_URL}/api/auth/callback/google`

### 1.5 User Profiles

- [ ] Update `docs/schemas/auth.sql` — `user_profiles` FK ke Better Auth `user` table (bukan `auth.users`)
- [ ] Update `src/db/schema.ts` — `userProfiles` referensi ke tabel `user` dari Better Auth
- [ ] Buat hook/trigger untuk auto-create profile saat user signup (via Better Auth `databaseHooks.user.create.after`)
- [ ] Schemas/models (`src/schemas/user-profile.ts`, `src/models/user-profile.ts`) — tetap sama

### 1.6 Middleware & Protected Routes

- [ ] Update `src/proxy.ts` — hapus import Supabase, ganti session check pakai Better Auth
- [ ] Hapus `src/lib/supabase/` — semua file (client.ts, server.ts, proxy.ts) tidak diperlukan lagi
- [ ] Implement route protection: cek session via Better Auth di middleware, redirect ke `/login` jika unauthenticated
- [ ] Hapus `supabase/config.toml` (konfigurasi Google OAuth Supabase — tidak diperlukan lagi)

### 1.7 Login UI

- [ ] Update login page — ganti `authProvider.signIn()` ke `authClient.signIn.social({ provider: 'google' })`
- [ ] Update `src/app/[locale]/(public)/login/_components/login-button.tsx` — pakai Better Auth client
- [ ] Handle auth errors (popup blocked, cancelled, dll)

### 1.8 User Context & Hooks

- [ ] Gunakan `useSession()` dari `src/lib/auth-client.ts` (Better Auth React hook, bukan custom hook)
- [ ] Hapus custom `useUser`, `UserProvider` jika ada — `useSession()` sudah cukup
- [ ] Update layout `(private)` jika perlu

### 1.9 Connect Existing UI to Real User

- [ ] Update `@header` dengan user info riil
- [ ] Update `@sidebar` dengan user info riil
- [ ] Update navigation profile link dengan username riil

---

## Cleanup: Hapus Supabase Auth

File yang perlu dihapus saat implementasi Better Auth:

| File | Alasan |
|---|---|
| `src/lib/supabase/client.ts` | Diganti oleh `src/lib/auth-client.ts` |
| `src/lib/supabase/server.ts` | Diganti oleh `src/lib/auth.ts` server config |
| `src/lib/supabase/proxy.ts` | Diganti oleh session check di middleware |
| `src/services/auth-provider.ts` | Abstraction layer tidak diperlukan — Better Auth sudah provider-agnostic |
| `src/lib/auth.ts` | Rewrite — ganti dari abstraction wrapper ke Better Auth server config |
| `src/app/api/auth/callback/route.ts` | Diganti oleh catch-all `[...all]/route.ts` |
| `supabase/config.toml` | Konfigurasi Supabase, tidak diperlukan |

---

## New Schema Files

| File | Deskripsi |
|---|---|
| `docs/schemas/auth.sql` | Better Auth tables (`user`, `session`, `account`, `verification`) + `user_profiles` |

## Files yang Akan Ditambah/Modify

| File | Perubahan |
|---|---|
| `src/lib/auth.ts` | Better Auth server config (Drizzle adapter, Google OAuth, session) |
| `src/lib/auth-client.ts` | [NEW] Better Auth React client (`signIn`, `signOut`, `useSession`) |
| `src/app/api/auth/[...all]/route.ts` | [NEW] Catch-all route handler `toNextJsHandler(auth)` |
| `src/db/auth-schema.ts` | [NEW] Generated auth tables schema (via Better Auth CLI) |
| `src/db/schema.ts` | Update `userProfiles` FK — referensi ke Better Auth `user` table |
| `src/env.ts` | Hapus Supabase env vars, tambah `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| `src/proxy.ts` | Update middleware — Better Auth session check |
| `src/schemas/user-profile.ts` | Tetap sama |
| `src/models/user-profile.ts` | Tetap sama |
| `src/app/[locale]/(public)/login/page.tsx` | Update — pakai Better Auth client |
| `src/app/[locale]/(public)/login/_components/login-button.tsx` | Update — `authClient.signIn.social()` |
| `docs/schemas/auth.sql` | Rewrite — Better Auth tables + `user_profiles` |
