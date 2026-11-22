# AGENTS.md - Qiroasro Development Guide

Qiroasro is an interactive Tajweed & Quran recitation learning platform built with **Next.js 16.4 (App Router)**, **React 19.2** (`reactCompiler: true`), **TypeScript 5 (strict)**, **Tailwind CSS v4**, **Drizzle ORM + PostgreSQL**, **Better Auth**, **`next-intl` v4**, **TanStack Query v5**, **TanStack Form v1**, **Valibot v1**, **Zustand v5**, **`@xyflow/react` v12**, and **Biome 2.3**.

---

## 1. Commands & Workflow

All commands use **pnpm** (never `npm` or `yarn`).

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start Next.js dev server (port 3000) |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm build:analyze` | Bundle analysis (`next analyze`) |
| `pnpm check` | Read-only Biome lint & format check (`biome check && biome format`) |
| `pnpm fix` | Apply Biome fixes & formatting (`biome check --write --unsafe && biome format --write`) |
| `pnpm check:types` | TypeScript type check (`tsc --noEmit --pretty`) |
| `pnpm check:packages` | Read-only outdated dependency check (`npm-check-updates`; pass `-u` to upgrade) |
| `pnpm db:push` | Push Drizzle schema directly to DB (no migration files) |
| `pnpm db:seed` | Run SQL seed files in `docs/sql/` via `tsx src/db/seed.ts` |

- **Before committing:** run `pnpm check && pnpm check:types`. Husky enforces Conventional Commits (`commitlint`) on `commit-msg`.
- **Gotchas:** CI (`.github/workflows/check.yml`) runs parallel `lint-and-types` (`pnpm check`, `pnpm check:types`) and `build` (`pnpm build` with dummy env vars — add `pnpm test` once Vitest/MSW is configured). Pages that query the DB only at runtime must opt into dynamic rendering (e.g., `await connection()` from `'next/server'`) so `pnpm build` with dummy `DATABASE_URL` does not fail during static prerendering. Releases are automated via `release-please` on `main`.

---

## 2. Project Organization & Architecture

### Feature-Based Colocation

Separate **Next.js routing** (`src/app/`) from **domain logic** (`src/features/<feature>/`) and **shared building blocks** (`src/components/`, `src/lib/`, `src/hooks/`):

```text
src/
├── app/                      # ROUTING ONLY (thin page, layout, error, route files)
│   ├── [locale]/             # next-intl dynamic locale segment
│   │   ├── (private)/        # Authenticated shell (@header, @sidebar, layout.tsx)
│   │   └── (public)/         # Public pages (home, login, playground)
│   ├── api/                  # Route handlers (auth, webhooks, REST)
│   ├── global-error.tsx      # Root error fallback
│   ├── robots.ts / sitemap.ts
├── features/<feature>/       # Domain modules (colocate only subfolders needed)
│   ├── components/           # Feature UI
│   ├── hooks/                # Feature hooks
│   ├── lib/                  # Feature constants & pure helpers
│   ├── models/               # Remote-to-local transformers (snake_case only)
│   ├── providers/            # Feature store/context providers
│   ├── queries/              # TanStack Query key factories & queryOptions
│   ├── schemas/              # Valibot schemas & inferred domain types
│   ├── services/             # Server Actions & data access
│   ├── stores/               # Feature Zustand stores
│   └── __tests__/            # Unit & integration tests (*.test.ts(x))
├── components/               # Global shared UI (ui/, common/, graph/, icons/)
├── db/                       # Drizzle ORM schemas (7 files) & seed.ts
├── hooks/                    # Truly global hooks (shared by 2+ features)
├── i18n/                     # next-intl config, routing, locale helpers, locales/{id,en,tr,ms,ar}
├── lib/                      # Global utilities & singletons (db, auth, routes, utils)
├── mocks/                    # MSW v2 handlers & Node server for tests
├── providers/                # Global providers (QueryClient, Theme, Motion)
├── services/                 # Cross-cutting Server Actions
├── styles/global.css         # Tailwind v4 @theme tokens & global CSS
├── types/                    # Global TypeScript declarations
├── env.ts                    # @t3-oss/env-nextjs + Valibot env validation
└── proxy.ts                  # Next.js 16 request proxy (locale + auth guard)
```

### Placement & Unidirectional Dependency Rules

1. **Keep `src/app/` thin:** `page.tsx` handles `generateMetadata`, `HydrationBoundary` prefetching, and composes `@/features/<feature>/...`.
2. **Route-local colocation rule:** **All new features and major refactors MUST live in `src/features/<feature>/`.** Reserve route-local folders inside `src/app/` strictly for trivial single-route helpers using plain names (e.g. `components/`, `lib/`, without a `_` prefix — folders without `page.tsx`/`route.ts` are non-routable in Next.js App Router).
3. **Promote to global only on reuse:** Move components/hooks/utilities to `src/components/`, `src/hooks/`, or `src/lib/` only when **2+ independent features** share them.
4. **No barrel-file (`index.ts`) bloat:** Import directly from target files for optimal Next.js tree-shaking and dev speed.
5. **Strict import direction (`Global → Features → App Router`):**
   - `src/lib/`, `src/components/`, `src/hooks/` must **never** import from `src/features/` or `src/app/`.
   - Features import globals via `@/...`, intra-feature via `./`/`../`, avoid deep cross-feature imports (lift to global or compose in `app/`), and **never** import from `src/app/`.

### Repo Architecture & Domain Gotchas

- **Routing & Auth:** `src/proxy.ts` strips locale prefixes, checks `PRIVATE_ROUTES` (`src/lib/routes.ts`), verifies Better Auth sessions, and redirects unauthenticated requests to `/login?callbackUrl=...`. `(private)/layout.tsx` prefetches user profile into `HydrationBoundary` (consumed via `useSuspenseQuery`). Better Auth (`src/lib/auth.ts`) auto-creates `userProfiles` rows via `databaseHooks`.
- **Database:** Schema changes use `drizzle-kit push` (`pnpm db:push`); **no migration files** exist. **`DATABASE_URL_DIRECT` (port 5432 session pooler) is mandatory for `drizzle-kit`** — transaction pooler `DATABASE_URL` (6543) crashes introspection. `mv_playground_data` is a PostgreSQL materialized view declared `.existing()` in `src/db/playground-schema.ts` (SQL in `docs/sql/views.sql`). `src/lib/db.ts` caches the Postgres client on `globalThis`.
- **i18n (`next-intl` v4):** 5 locales (`id`, `en`, `tr`, `ms`, `ar` RTL). Messages split into `global.json`, `page.json`, `quiz.json` — add new UI strings to **all 5 locales**. Always navigate via `@/i18n/navigation` (`Link`, `useRouter`, `usePathname`), never `next/navigation` directly. Note: `setRequestLocale(locale)` and `requestLocale` in `getRequestConfig` are **deprecated** in `next-intl` 4.15+; prefer Next.js 16's native `next/root-params` (`import { locale } from 'next/root-params'`) in `src/i18n/request.ts` and Server Components instead of adding new `setRequestLocale()` calls (remove legacy calls when migrating).
- **Env & Styling:** Validate all env vars once in `src/env.ts` (never read `process.env` directly in features/components). Tailwind v4 tokens live in `src/styles/global.css` (`@theme`, no `tailwind.config.ts`). Use `cn()`, semantic tokens (`bg-card`, `text-foreground`), and logical CSS (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`) for RTL support.
- **Domain Knowledge:** Refer to `docs/master.md`, `docs/books/`, `docs/plans/00-overview.md`, and the `shamela` MCP server for Tajweed content accuracy.

---

## 3. Code Style & Naming Conventions

Configured in `biome.json` (`2.3.x`): **80-char** line width, **2 spaces**, LF, single quotes JS / double JSX, trailing commas (except JSON), semicolons always, `organizeImports: "on"`, `linter.domains` (`next`, `react`, `test`), `noUnusedImports: "error"`, `useSortedClasses: "error"` (`clsx`, `cva`, `cn`, `tw`), and `useNamingConvention: "error"` (`strictCase: false`, allowing `snake_case` on object literal properties).

- **Files:** `kebab-case.tsx` (components), `use-*.ts` (hooks), `kebab-case.ts` (helpers/schemas/stores/services), `*.test.ts(x)` (unit/integration), `*.spec.ts` (Playwright E2E), Next.js conventions (`page.tsx`, `layout.tsx`, `error.tsx`, `proxy.ts`).
- **Symbols:** `PascalCase` components & types; `<ComponentName>Props`; `camelCase` functions/vars; `SCREAMING_SNAKE_CASE` constants; `<Entity>Schema` / `Remote<Entity>Schema`; `<Domain>Store` / `create<Domain>Store`; `<entity>Keys` / `get<Entity>Opt`; `handle*` internal handlers vs `on*` callback props; booleans prefixed with `is`/`has`/`should`/`can`.

---

## 4. Type Safety (`Readonly` Component Props & Strict Types)

### Mandatory `Readonly` Component Props

All React component props — Client Components, Server Components, Pages, Layouts, Error Boundaries, and UI primitives — **must be wrapped in `Readonly<...>`**, with array/collection props marked `readonly`.

```typescript
import type { ComponentProps, PropsWithChildren } from 'react';

type UserCardProps = Readonly<{
  name: string;
  badges: readonly string[];
}>;

interface ActionButtonProps extends ComponentProps<'button'> {
  isLoading?: boolean;
}

export function ActionButton({
  isLoading = false,
  children,
  ...props
}: Readonly<ActionButtonProps>) {
  return <button disabled={isLoading || props.disabled} {...props}>{children}</button>;
}

type SectionShellProps = Readonly<PropsWithChildren<{ title: string }>>;

type LocalePageProps = Readonly<{
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>;
```

### Strict Type Rules

- **Never use `any`, `@ts-ignore`, unjustified `@ts-expect-error`, or unsafe `!`.**
- Model untrusted inputs (APIs, forms, `searchParams`, materialized views, `localStorage`) as `unknown` and validate at boundaries with **Valibot** (`parse` / `safeParse`) or type guards.
- Use `satisfies` to validate shapes while preserving literal inference, and discriminated unions with exhaustive `never` checks.
- Use `type` for `Readonly<{ ... }>` props, unions, tuples, and `v.InferOutput`; use `interface` for extendable contracts (`extends ComponentProps<...>`) or declaration merging.
- Omit redundant JSDoc; add JSDoc only for public APIs, non-obvious invariants, `@throws`, or `@deprecated`.

---

## 5. React 19, Next.js 16 & Data Patterns

- **Server-First (RSC by Default):** Keep components as Server Components; add `'use client'` only at interactive leaves and compose server content via `children`/slot props.
- **React 19 APIs:** Pass `ref` as a regular prop (**never** `forwardRef`); use `<Context value={...}>` (**never** `<Context.Provider>`) and `use(Context)`.
- **React Compiler (`reactCompiler: true`):** Do **not** add premature `useMemo`, `useCallback`, or `React.memo` unless profiling proves a specific bottleneck.
- **Forms:** Use `@tanstack/react-form` v1 + Valibot v1 directly (Valibot implements Standard Schema natively — no adapter needed), or Server Actions with `v.safeParse` + React 19 `useActionState`.
- **Services & Transformers:** Direct Drizzle tables already map to `camelCase` — **no `models/` transformer needed**; always check `if (!row) return null;` before `parse()`. Use `Remote*Schema` + `models/` transformers only for `snake_case` REST APIs or materialized view JSONB.
- **TanStack Query v5:** Co-locate `as const` query key factories (`<entity>Keys`) and `queryOptions(...)` (`get<Entity>Opt`) in `queries/`; prefetch on the server with `QueryClient` + `HydrationBoundary` + `dehydrate(queryClient)`.

---

## 6. State Management (Zustand v5)

| State Kind | Owner |
|------------|-------|
| Server / async data | **RSC + TanStack Query v5** |
| Shareable / navigable filters & tabs | **URL `searchParams`** |
| Forms & validation | **TanStack Form v1 / `useActionState`** |
| Ephemeral local UI | **React `useState`** |
| Shared client feature state | **Zustand v5** (scoped provider) |

- **React 19 + React Compiler Safe Provider:** Initialize vanilla stores (`createStore`) inside `useState(() => createQuizStore())` — **never** read or write `ref.current` during render (`react-hooks/refs`). Provide via `<QuizStoreContext value={store}>` and read via `use(QuizStoreContext)`. Wrap provider props in `Readonly<PropsWithChildren>`.
- **Zustand v5 Selectors:** Subscribe to primitive/function fields, or wrap multi-field/derived objects/arrays with `useShallow` from `'zustand/react/shallow'` to prevent `useSyncExternalStore` infinite re-render loops. Never select `(s) => s`.
- **Persisted Stores (SSR-safe):** Use `skipHydration: true`, `partialize` serializable fields, and call `void store.persist.rehydrate()` inside `useEffect`.

---

## 7. Error Handling

- **Expected vs. Unexpected Errors:** Treat expected failures (validation, auth, missing records) as **typed data** (`ActionResult<T> = { ok: true; data: T } | { ok: false; error: string }`) using `v.safeParse`, not thrown exceptions. Reserve throws for unexpected outages/invariants.
- **Next.js Control-Flow Rule:** Never catch/swallow `redirect()`, `notFound()`, `forbidden()`, or `unauthorized()` inside `try/catch` — call them outside `try/catch` or invoke `unstable_rethrow(error)` from `'next/navigation'` first.
- **Error Boundaries:** `<Suspense>` handles **loading states, not errors**. Pair `<ErrorBoundary fallback={...}>` (e.g. `react-error-boundary`), `error.tsx` (`'use client'`, `Readonly<{ error: Error & { digest?: string }; reset: () => void }>`), `global-error.tsx`, and `not-found.tsx`.
- **TanStack Query v5:** Use `isPending` for initial load and `isError` with retry (`refetch()`), or wrap `useSuspenseQuery` with `<QueryErrorResetBoundary>`, `<ErrorBoundary>`, and `<Suspense>`. Never leak raw stack traces/SQL errors or leave empty `catch {}` blocks.

---

## 8. React Flow Performance (`@xyflow/react` v12)

- **Shared Primitives:** Always import `BaseNode`, `BaseNodeHeader`, `BaseNodeHeaderTitle`, `BaseNodeContent`, `BaseHandle`, and `NodeAppendix` from `@/components/graph/`, not raw UI primitives from `@xyflow/react`. Canvas, hooks, and types come from `@xyflow/react`.
- **Typed Nodes & Module Scope:** Define `Node<Data, 'type'>` with `Readonly<NodeProps<CustomNode>>`; declare `nodeTypes` and `edgeTypes` at **module scope** outside components.
- **Narrow Subscriptions:** Never call `useNodes()`/`useEdges()` inside custom nodes or toolbars. Use `useNodesData(nodeId)`, `useNodeConnections()`, and narrow primitive `useStore` selectors (or `useShallow`).
- **Rendering:** Enable `onlyRenderVisibleElements` for large graphs, keep node CSS lightweight (avoid heavy `backdrop-blur`/filters on every node), apply `memo()` on heavy custom nodes only if pan/zoom profiling requires it, and provide keyboard/click alternatives to drag-only interactions.

---

## 9. Testing Guidelines (Testing Trophy + MSW v2)

- **Layers:** Static (`pnpm check`, `pnpm check:types`) → Unit (Vitest) → Integration (Vitest + Testing Library + **MSW v2**) → E2E (Playwright in `e2e/*.spec.ts`). Colocate unit/integration tests in `src/features/<feature>/__tests__/*.test.ts(x)` and `src/lib/__tests__/*.test.ts`.
- **Network Mocking with MSW v2 (`msw/node`):** Intercept HTTP at the network boundary using **`http`, `HttpResponse`, and `setupServer`** (never legacy v1 `rest`/`res`/`ctx`) instead of mocking `fetch`, `axios`, or TanStack Query hooks via `vi.mock()`.
  - Keep default handlers in `src/mocks/handlers.ts` and server in `src/mocks/server.ts`.
  - In `src/test/setup.ts`: `beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))`, `afterEach(() => server.resetHandlers())`, `afterAll(() => server.close())`.
  - Override per test with `server.use(http.get(...))` to test 500s, empty states, or `HttpResponse.error()`, using a fresh `QueryClient({ defaultOptions: { queries: { retry: false } } })` per test.
  - Reserve `vi.mock()`/`vi.spyOn()` for non-HTTP boundaries (`next/navigation`, `vi.useFakeTimers()`, missing JSDOM/Happy-DOM APIs like `ResizeObserver`, or isolated DB unit tests).
- **Testing Library:** Prefer `userEvent.setup()` over `fireEvent`; query by accessibility role first (`getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByText` > `getByTestId`); use `findBy*` for async assertions; test observable behavior.

---

## 10. SEO, Accessibility (WCAG 2.2 AA) & Core Web Vitals

- **SEO:** Public pages export `generateMetadata({ params }: Readonly<{ params: Promise<{ locale: string }> }>)` with `getLocalePath`, `getAlternateLanguages`, and `getOgLocale` (`@/i18n/locale`), `metadataBase` in root layout, and `robots.ts` / `sitemap.ts`. Private routes opt out with `robots: { index: false, follow: false }`.
- **Accessibility (WCAG 2.2 AA):** Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`), skip link, single `<h1>`, contrast ≥ 4.5:1 (≥ 3:1 UI/large text), target size ≥ 24×24px (aim 44×44px), Focus Not Obscured (SC 2.4.11), single-pointer/keyboard alternatives for drags (SC 2.5.7), `prefers-reduced-motion` (`MotionConfig reducedMotion="user"`), `lang`/`dir` on `<html>` with logical CSS for Arabic RTL, `role="alert"`/`aria-live="polite"`, and never disable pinch-zoom (`userScalable: false`).
- **Core Web Vitals (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1):**
  - Use `next/image` with **`preload`** (Next.js 16 replacement for deprecated `priority`) and `fetchPriority="high"` on hero LCP images; never `loading="lazy"` on LCP media.
  - Set explicit dimensions/`aspect-ratio`, `next/font` (`display: 'swap'`), and dimension-matched skeletons for zero CLS.
  - Keep bundles lean (`next/dynamic`, `LazyMotion`, `pnpm build:analyze`), parallelize server fetches (`Promise.all`), use `startTransition`/`scheduler.yield()` + `content-visibility: auto` for INP, limit `<link rel="preconnect">` to ≤ 4 origins, serve immutable hashed assets, and preserve **bfcache** (no `unload` listeners, avoid `Cache-Control: no-store` on public pages).

---

## 11. Core Principles

- **KISS:** Favor clear, small, single-purpose functions and shallow nesting over clever one-liners.
- **DRY (Rule of Three):** Extract shared logic once a pattern genuinely repeats and shares a single reason to change; avoid premature wrong abstractions.
- **SOLID:** Separate data fetching (`services/`, `queries/`), pure logic (`lib/`, `models/`), and UI (`components/`); extend via registries/mappings; keep `Readonly` props minimal and segregated.
- **YAGNI:** Build only what current requirements demand — no speculative fields, unused flags, or empty boilerplate directories.
