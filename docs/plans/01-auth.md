# Task 1: Auth & User Management

> Fondasi untuk semua fitur private app. Tanpa auth, tidak bisa track progress, XP, streak, dll.

## Status: `[/]` Sedang dikerjakan — Login flow selesai ✅, sisa: userProfiles, middleware, connect UI

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

- [x] Install package: `pnpm add better-auth`
- [x] Tambah env vars: `BETTER_AUTH_SECRET` (32+ chars), `BETTER_AUTH_URL`
- [x] Update `src/env.ts` — tambah Better Auth env vars
- [x] Buat `src/lib/auth.ts` — Better Auth server config:
  - [x] Drizzle adapter (`drizzleAdapter`)
  - [x] Social providers (Google)
  - [x] Session config (expiry, cookie cache)
  - [x] Rate limiting
- [x] Buat `src/lib/auth-client.ts` — Better Auth React client:
  - Import dari `better-auth/client`
  - Export `authClient` (signIn, signOut, useSession via authClient)

### 1.2 Route Handler

- [x] Buat `src/app/api/auth/[...all]/route.ts` — `toNextJsHandler(auth)` → export `{ GET, POST }`

### 1.3 Database Schema (Auth Tables)

- [x] Generate auth schema via Better Auth CLI: `pnpm dlx @better-auth/cli@latest generate` → dipindah ke `src/db/auth-schema.ts`
- [x] Auth tables (`user`, `session`, `account`, `verification`) sudah masuk ke DB
- [x] Master tables dari `master.sql` sudah di-define di `src/db/common-schema.ts`
- [x] `drizzle.config.ts` pakai schema array (3 files) + `DATABASE_URL_DIRECT` untuk drizzle-kit CLI

> [!NOTE]
> Schema dipecah menjadi 3 file: `auth-schema.ts` (auth), `common-schema.ts` (master tables + waitlist), `playground-schema.ts` (mv). Untuk menjalankan drizzle-kit, gunakan: `pnpm drizzle-kit push` — otomatis pakai `DATABASE_URL_DIRECT` (session pooler, port 5432).

### 1.4 Google OAuth

- [x] Configure `socialProviders.google` di `src/lib/auth.ts`
- [x] Update env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- [x] Verifikasi redirect URI di Google Cloud Console: `{BETTER_AUTH_URL}/api/auth/callback/google`

### 1.5 User Profiles

- [ ] Buat `src/db/user-schema.ts` — [NEW] schema khusus private-app user data
- [ ] Definisikan `userProfiles` di `src/db/user-schema.ts` — FK ke tabel `user` di `auth-schema.ts`
- [ ] Buat hook auto-create profile saat user signup (via Better Auth `databaseHooks.user.create.after`)
- [ ] Schemas/models (`src/schemas/user-profile.ts`, `src/models/user-profile.ts`) — tetap sama

> [!NOTE]
> `user-schema.ts` adalah schema domain untuk private-app user data. Berbeda dengan `common-schema.ts` (master data, public) dan `auth-schema.ts` (managed by Better Auth). Ke depan tabel seperti `userProgress`, `userSettings`, `userStats` juga masuk di sini.

### 1.6 Middleware & Protected Routes

- [ ] Tambahkan session check pakai Better Auth di middleware
- [ ] Implement route protection: redirect ke `/login` jika unauthenticated

### 1.7 Login UI

- [x] Update login page — pakai `authClient.signIn.social({ provider: 'google' })`
- [x] Update `src/app/[locale]/(public)/login/_components/login-button.tsx` — pakai Better Auth client
- [x] Handle auth errors (popup blocked, cancelled, dll)

### 1.8 User Context & Hooks

- [ ] Gunakan `useSession()` dari `src/lib/auth-client.ts` (Better Auth React hook)
- [ ] Update layout `(private)` jika perlu

### 1.9 Connect Existing UI to Real User

- [ ] Update `@header` dengan user info riil
- [ ] Update `@sidebar` dengan user info riil
- [ ] Update navigation profile link dengan username riil

---

## Files yang Akan Ditambah/Modify

| File | Status | Perubahan |
|---|---|---|
| `src/lib/auth.ts` | [x] | Better Auth server config (Drizzle adapter, Google OAuth, session, rate limit) |
| `src/lib/auth-client.ts` | [x] | [NEW] Better Auth React client (`authClient`) |
| `src/app/api/auth/[...all]/route.ts` | [x] | [NEW] Catch-all route handler `toNextJsHandler(auth)` |
| `src/db/auth-schema.ts` | [x] | [NEW] Generated auth tables schema (via Better Auth CLI) — dipindah ke `src/db/` |
| `src/db/common-schema.ts` | [x] | [NEW] waitlist (dipecah dari schema.ts) |
| `src/db/playground-schema.ts` | [x] | [NEW] mv_playground_data (dipecah dari schema.ts) |
| `src/env.ts` | [x] | `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `DATABASE_URL_DIRECT` |
| `drizzle.config.ts` | [x] | Schema array (3 files), prefer `DATABASE_URL_DIRECT` (session pooler) untuk drizzle-kit |
| `src/lib/db.ts` | [x] | Spread 3 schema ke satu object |
| `src/schemas/user-profile.ts` | — | Tetap sama |
| `src/models/user-profile.ts` | — | Tetap sama |
| `src/db/user-schema.ts` | [ ] | [NEW] Schema domain private-app user (`userProfiles`, dst) |
