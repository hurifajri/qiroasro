# Qiroasro Coding Guidelines

> Panduan ini dibuat untuk memastikan konsistensi, maintainability, dan kualitas kode yang tinggi bagi AI assistant maupun developer yang berkontribusi pada project ini.

---

## Table of Contents

0. [Available Scripts](#0-available-scripts)
1. [Core Principles](#1-core-principles)
2. [Naming Conventions](#2-naming-conventions)
3. [File & Folder Organization](#3-file--folder-organization)
4. [State Management (Zustand)](#4-state-management-zustand)
5. [Code Patterns & Best Practices](#5-code-patterns--best-practices)
6. [SEO, Accessibility & Semantic HTML](#6-seo-accessibility--semantic-html)
7. [Error Handling](#7-error-handling)
8. [Testing Guidelines](#8-testing-guidelines)

---

## 0. Available Scripts

All commands should be run with `pnpm`:

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js development server |
| `pnpm build` | Build production bundle |
| `pnpm start` | Start production server |
| `pnpm format` | Format code with Biome |
| `pnpm check` | Run Biome linter & apply safe fixes |
| `pnpm check:types` | TypeScript type checking (no emit) |
| `pnpm check:packages` | Check for outdated packages |

### Common Workflows

```bash
# Before committing
pnpm check          # Lint + format
pnpm check:types    # Type check

# Start development
pnpm dev

# Production build
pnpm build
pnpm start
```

---

## 1. Core Principles

### KISS (Keep It Simple, Stupid)

- Prefer simple, readable solutions over clever ones
- If a solution needs extensive comments to explain, it's probably too complex
- Break down complex logic into smaller, focused functions

```typescript
// ❌ Too complex
const result = data.filter(x => x.active).map(x => ({ ...x, score: x.points * (x.bonus ? 1.5 : 1) })).sort((a, b) => b.score - a.score).slice(0, 10);

// ✅ Simple and readable
const activeItems = data.filter(item => item.active);
const withScores = activeItems.map(item => ({
  ...item,
  score: calculateScore(item),
}));
const topTen = sortByScoreDesc(withScores).slice(0, 10);
```

### DRY (Don't Repeat Yourself)

- Extract repeated logic into reusable functions, hooks, or components
- Create shared utilities in `src/lib/` for cross-cutting concerns
- Use constants for magic numbers and repeated strings

```typescript
// ❌ Repeated logic
// In component A
const supabase = getSupabaseClient();
const { data, error } = await supabase.from('letters').select('*').order('sort_order');
if (error) throw new Error(error.message);

// In component B (same pattern repeated)
const supabase = getSupabaseClient();
const { data, error } = await supabase.from('traits').select('*').order('sort_order');
if (error) throw new Error(error.message);

// ✅ DRY - create a generic service
async function fetchFromTable<T>(table: string, orderBy?: string): Promise<T[]> {
  const supabase = getSupabaseClient();
  let query = supabase.from(table).select('*');
  if (orderBy) query = query.order(orderBy);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as T[];
}
```

### SOLID Principles

#### S - Single Responsibility Principle
Each module/class/function should have one reason to change.

```typescript
// ❌ Multiple responsibilities
function UserCard({ user }) {
  // Fetching, formatting, and rendering all in one
  const [data, setData] = useState();
  useEffect(() => { fetch(...).then(setData) }, []);
  const formattedDate = new Date(data.date).toLocaleDateString('id-ID');
  return <div>{formattedDate}</div>;
}

// ✅ Separated responsibilities
// Hook for data fetching
function useUserData(userId: string) { ... }

// Utility for formatting
function formatDate(date: Date): string { ... }

// Component only for rendering
function UserCard({ user }: UserCardProps) { ... }
```

#### O - Open/Closed Principle
Open for extension, closed for modification.

```typescript
// ✅ Extensible node types without modifying core logic
const nodeTypes: NodeTypes = {
  letter: LetterNode,
  articulationArea: ArticulationAreaNode,
  articulationPoint: ArticulationPointNode,
  // Easy to add new types without changing existing code
  newType: NewTypeNode,
};
```

#### L - Liskov Substitution Principle
Subtypes must be substitutable for their base types.

#### I - Interface Segregation Principle
Prefer many specific interfaces over one large interface.

```typescript
// ❌ Large interface
interface QuizProps {
  mode: QuizMode;
  settings: QuizSettings;
  nodes: Node[];
  edges: Edge[];
  // ... 20 more props
}

// ✅ Segregated interfaces
interface QuizModeProps {
  mode: QuizMode;
}

interface QuizSettingsProps {
  settings: QuizSettings;
}

interface QuizGraphProps {
  nodes: Node[];
  edges: Edge[];
}
```

#### D - Dependency Inversion Principle
Depend on abstractions, not concretions.

```typescript
// ✅ Using dependency injection via props/context
interface UseQuizTimerOptions {
  duration: number;
  enabled: boolean;
  onTimeUp?: () => void;  // Callback abstraction
}
```

### YAGNI (You Aren't Gonna Need It)

- Don't add functionality until it's actually needed
- Avoid premature optimization
- Remove unused code and imports

```typescript
// ❌ Building for hypothetical future requirements
interface Letter {
  id: number;
  symbol: string;
  futureField1?: string;  // "We might need this later"
  futureField2?: number;  // "Just in case"
}

// ✅ Only what's needed now
interface Letter {
  id: number;
  symbol: string;
}
```

---

## 2. Naming Conventions

### Files & Folders

| Type | Convention | Example |
|------|------------|---------|
| Components | `kebab-case.tsx` | `quiz-settings.tsx` |
| Hooks | `use-*.ts` | `use-quiz-timer.ts` |
| Utilities | `kebab-case.ts` | `graph-helpers.ts` |
| Types/Schemas | `kebab-case.ts` | `quiz.ts` |
| Constants | `kebab-case.ts` | `constants.ts` |

### Code Elements

| Type | Convention | Example |
|------|------------|---------|
| Components | `PascalCase` | `QuizSettings` |
| Functions | `camelCase` | `handleSubmit` |
| Variables | `camelCase` | `isLoading` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_RETRIES` |
| Types/Interfaces | `PascalCase` | `QuizState` |
| Zod Schemas | `PascalCase` + `Schema` | `LetterSchema` |
| Zustand Stores | `PascalCase` + `Store` | `QuizStore` |

### Prefixes & Suffixes

```typescript
// Hooks must start with 'use'
useQuizTimer, useGlobalStore

// Boolean variables should be prefixed with is/has/should/can
isLoading, hasError, shouldRefresh, canSubmit

// Handlers should be prefixed with 'handle' or 'on'
handleClick, onSubmit

// Remote types (from API) should be prefixed with 'Remote'
RemoteLetter, RemoteLetterSchema
```

---

## 3. File & Folder Organization

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes group
│   │   ├── components/    # Page-specific components
│   │   ├── hooks/         # Page-specific hooks
│   │   ├── lib/           # Page-specific utilities
│   │   ├── models/        # Data transformers
│   │   ├── providers/     # React context providers
│   │   ├── queries/       # TanStack Query options
│   │   ├── schemas/       # Zod schemas & types
│   │   ├── services/      # API/data services
│   │   └── stores/        # Zustand stores
│   └── api/               # API routes
├── components/
│   ├── common/            # Shared components
│   ├── ui/                # UI primitives (shadcn/ui)
│   └── [feature]/         # Feature-specific shared components
├── hooks/                 # Global hooks
├── lib/                   # Global utilities
├── models/                # Global data transformers
├── providers/             # Global providers
├── queries/               # Global query options
├── schemas/               # Global schemas
├── services/              # Global services
├── stores/                # Global stores
└── styles/                # Global styles
```

### Placement Rules

1. **Global vs Feature-specific**:
   - If used across multiple features → Global (`src/[folder]/`)
   - If used only in one feature → Feature-specific (`src/app/[route]/[folder]/`)

2. **Schema Organization**:
   - Remote types (snake_case from API): Defined with `Remote` prefix
   - Local types (camelCase): Transformed from Remote types
   - Keep related types together in one schema file

3. **Avoid Duplicate Names**:
   - If same filename exists in global and feature-specific, add context
   - Example: `graph-layout.ts` (global) vs `graph-generator.ts` (feature)

### Import Rules

```typescript
// ❌ NEVER import from page-level to global
// Global files should never depend on page-specific code
import { something } from '@/app/(public)/playground/lib/graph'; // ❌ NO!

// ✅ Import from global to page-level (absolute import alias)
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Letter } from '@/schemas/letter';

// ✅ Import within same page-level (relative import)
// Inside src/app/(public)/playground/components/quiz.tsx
import { useQuizStore } from '../providers/quiz';
import type { QuizMode } from '../schemas/quiz';
import { QuizCanvas } from './quiz-canvas';

// ✅ Import within same global level (relative import)
// Inside src/lib/utils.ts
import { GLOBAL_CONSTANTS } from './constants';
```

| From | To | Import Style |
|------|----|--------------|
| Global | Page-level | ❌ Never allowed |
| Page-level | Global | ✅ Absolute alias (`@/`) |
| Page-level | Same page-level | ✅ Relative (`../` or `./`) |
| Global | Same global | ✅ Relative (`./`) |

---

## 4. State Management (Zustand)

### Store Structure

```typescript
// 1. Define State interface
interface QuizState {
  isDialogOpen: boolean;
  mode: QuizMode | null;
  settings: QuizSettingsValues;
}

// 2. Define Actions interface
interface QuizActions {
  openDialog: () => void;
  closeDialog: () => void;
  setMode: (mode: QuizMode | null) => void;
}

// 3. Combine as Store type
export type QuizStore = QuizState & QuizActions;

// 4. Define initial state
const initialState: QuizState = {
  isDialogOpen: false,
  mode: null,
  settings: DEFAULT_QUIZ_SETTINGS,
};

// 5. Create store
export function createQuizStore() {
  return createStore<QuizStore>()((set) => ({
    ...initialState,
    openDialog: () => set({ isDialogOpen: true }),
    closeDialog: () => set({ isDialogOpen: false }),
    setMode: (mode) => set({ mode }),
  }));
}
```

### Provider Pattern

```typescript
'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

type StoreApi = ReturnType<typeof createStore>;
const StoreContext = createContext<StoreApi | undefined>(undefined);

export function StoreProvider({ children }: React.PropsWithChildren) {
  const storeRef = useRef<StoreApi>(undefined);
  storeRef.current ??= createStore();

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
}

export function useAppStore<T>(selector: (store: Store) => T): T {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within StoreProvider');
  }
  return useStore(context, selector);
}
```

### Best Practices

1. **Avoid useState when Zustand store exists**:
   ```typescript
   // ❌ Duplicating store state with useState
   const [isStarted, setIsStarted] = useState(false);

   // ✅ Use store directly
   const isStarted = useQuizStore(s => s.isStarted);
   const startQuiz = useQuizStore(s => s.startQuiz);
   ```

2. **Use granular selectors for performance**:
   ```typescript
   // ❌ Subscribes to entire store
   const store = useQuizStore(s => s);

   // ✅ Only subscribes to specific value
   const isStarted = useQuizStore(s => s.isStarted);
   const startQuiz = useQuizStore(s => s.startQuiz);

   // ✅ Or use shallow selector for performance
   import { useShallow } from 'zustand/react/shallow';
   const { isStarted, startQuiz } = useQuizStore(
     useShallow((s) => ({
       isStarted: s.isStarted,
       startQuiz: s.startQuiz,
     }))
   );
   ```

3. **Group related actions**:
   ```typescript
   // Group by domain
   // Dialog actions
   openDialog: () => set({ isDialogOpen: true }),
   closeDialog: () => set({ isDialogOpen: false }),

   // Quiz actions
   startQuiz: () => set({ isStarted: true }),
   resetQuiz: () => set({ ...initialQuizState }),
   ```

---

## 5. Code Patterns & Best Practices

### Component Patterns

```typescript
// ✅ Proper component structure
'use client';

import { useTranslations } from 'next-intl';
import type { ComponentProps } from './types';

interface Props extends ComponentProps {
  // Additional props
}

export function ComponentName({ prop1, prop2 }: Props) {
  const t = useTranslations('namespace');

  // 1. Hooks first
  const [state, setState] = useState();

  // 2. Derived state
  const derivedValue = useMemo(() => compute(state), [state]);

  // 3. Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // 4. Handlers
  const handleAction = useCallback(() => {
    // Logic
  }, [dependencies]);

  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Custom Hooks Pattern

```typescript
// ✅ Good hook structure
export interface UseHookOptions {
  /** Option description */
  option1: string;
  /** Optional callback */
  onComplete?: () => void;
}

export interface UseHookReturn {
  /** Return value description */
  data: Data | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook description
 */
export function useCustomHook(options: UseHookOptions): UseHookReturn {
  // Implementation
}
```

### Service Pattern

```typescript
// services/entity.ts
export async function getEntities(): Promise<Entity[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order(COLUMN_SORT_ORDER);

    if (error) throw new Error(error.message);

    const remoteEntities = RemoteEntitiesSchema.parse(data);
    return transformRemoteEntities(remoteEntities);
  } catch (error) {
    // Proper error handling
    throw error;  // Let React Query handle it
  }
}
```

### Query Options Pattern

```typescript
// queries/entity.ts
const entityKeys = {
  all: ['entities'] as const,
  list: () => [...entityKeys.all, 'list'] as const,
  detail: (id: number) => [...entityKeys.all, 'detail', id] as const,
};

export function getEntitiesOpt() {
  return queryOptions({
    queryKey: entityKeys.list(),
    queryFn: () => getEntities(),
    staleTime: 5 * 60 * 1000,  // 5 minutes
  });
}
```

### Constants Pattern

```typescript
// lib/constants.ts

// Storage keys
export const GLOBAL_STORE_KEY = 'app_global-store';

// Table names
export const TABLE_LETTERS = 'letters';

// Enum-like constants (use as const for type inference)
export const VIEW_MODES = ['all', 'filter', 'search'] as const;
export type ViewMode = (typeof VIEW_MODES)[number];

// Configuration objects
export const QUIZ_CONFIG = {
  MIN_QUESTIONS: 1,
  MAX_QUESTIONS: 10,
  DEFAULT_TIMER: 30,
} as const;
```

---

## 6. SEO, Accessibility & Semantic HTML

### SEO Requirements

```typescript
// Every page.tsx must have generateMetadata
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('page.metadata');
  const locale = await getLocale();

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: '/page-path',
      languages: { id: '/page-path', en: '/page-path' },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: locale === 'id' ? 'id_ID' : 'en_US',
    },
  };
}
```

### Semantic HTML

```typescript
// ✅ Proper semantic structure
<>
  <header>
    <nav aria-label="Main navigation">
      {/* Navigation items */}
    </nav>
  </header>

  <main>
    <h1 className="sr-only">{t('title')}</h1>
    <article>
      <section aria-labelledby="section-heading">
        <h2 id="section-heading">{t('section.title')}</h2>
        {/* Content */}
      </section>
    </article>
  </main>

  <footer>
    {/* Footer content */}
  </footer>
</>
```

### Accessibility Checklist

- [ ] Every page has an `<h1>` (can be visually hidden with `sr-only`)
- [ ] Interactive elements are keyboard accessible
- [ ] Images have meaningful `alt` text
- [ ] Form inputs have associated `<label>` elements
- [ ] Buttons have accessible names (text content or `aria-label`)
- [ ] Color contrast meets WCAG 2.1 AA standards (4.5:1 for text)
- [ ] Focus states are visible
- [ ] No `userScalable: false` in viewport settings

```typescript
// ❌ Avoid
export const viewport: Viewport = {
  userScalable: false,  // Breaks accessibility!
};

// ✅ Allow user scaling
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};
```

### Button Accessibility

```typescript
// ❌ Icon-only button without accessible name
<Button onClick={handleClick}>
  <TrashIcon />
</Button>

// ✅ With aria-label
<Button onClick={handleClick} aria-label={t('delete')}>
  <TrashIcon />
</Button>

// ✅ Or with sr-only text
<Button onClick={handleClick}>
  <TrashIcon />
  <span className="sr-only">{t('delete')}</span>
</Button>
```

---

## 7. Error Handling

### Service Layer

```typescript
// ✅ Proper error handling
export async function getLetters(): Promise<Letter[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE_LETTERS).select('*');

  if (error) {
    console.error('[getLetters] Supabase error:', error);
    throw new Error(`Failed to fetch letters: ${error.message}`);
  }

  try {
    return RemoteLettersSchema.parse(data).map(transformRemoteLetter);
  } catch (parseError) {
    console.error('[getLetters] Parse error:', parseError);
    throw new Error('Invalid data format received from server');
  }
}
```

### Component Layer

```typescript
// Use React Query's error handling
function LetterList() {
  const { data, error, isLoading } = useQuery(getLettersOpt());

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!data?.length) return <EmptyState />;

  return <List items={data} />;
}
```

### Error Boundaries

```typescript
// components/error-boundary.tsx
'use client';

export function ErrorBoundary({
  children,
  fallback
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

// Usage in layout or page
<ErrorBoundary fallback={<ErrorFallback />}>
  <PageContent />
</ErrorBoundary>
```

---

## 8. Testing Guidelines

### Testing Trophy Pattern

We follow Kent C. Dodds' [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications) approach:

```
        🏆 E2E Tests (few)
       ━━━━━━━━━━━━━━━━━━
      Integration Tests (many)
     ━━━━━━━━━━━━━━━━━━━━━━━━
        Unit Tests (some)
       ━━━━━━━━━━━━━━━━━━
      Static Analysis (base)
```

| Layer | What to Test | Tools |
|-------|--------------|-------|
| **Static** | Type errors, lint issues | TypeScript, Biome |
| **Unit** | Pure functions, utilities, transformers | Vitest |
| **Integration** | Component interactions, hooks, stores | Vitest + Testing Library |
| **E2E** | Critical user flows | Playwright |

### Priority Order

1. **Static Analysis** (always on, catches most bugs)
   - TypeScript strict mode
   - Biome linter & formatter

2. **Integration Tests** (highest ROI)
   - Test components with their hooks and stores
   - Test user interactions, not implementation details

3. **Unit Tests** (for pure logic)
   - Model transformers (`transformRemoteLetter`)
   - Utility functions (`cn`, `formatDate`)
   - Complex calculations

4. **E2E Tests** (critical paths only)
   - Main user journeys
   - Payment flows, authentication

### Test File Location

```
src/
├── lib/
│   ├── utils.ts
│   └── __tests__/
│       └── utils.test.ts
├── models/
│   ├── letter.ts
│   └── __tests__/
│       └── letter.test.ts
```

### Test Naming

```typescript
describe('transformRemoteLetter', () => {
  it('should convert snake_case to camelCase', () => {
    // Test
  });

  it('should handle missing optional fields', () => {
    // Test
  });
});
```

---

## Quick Reference

### Do's ✅

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use descriptive variable names
- Keep components under 200 lines
- Use proper semantic HTML
- Test critical business logic
- Import global → page-level with absolute alias (`@/`)
- Import within same level with relative paths (`./`, `../`)

### Don'ts ❌

- Don't use `any` type
- Don't mutate state directly
- Don't use `// biome-ignore` without justification
- Don't ignore TypeScript errors with `@ts-ignore`
- Don't commit console.log (use proper logging)
- Don't hardcode strings (use i18n)
- Don't duplicate code across components
- Don't import from page-level to global

### Documentation

**JSDoc in TypeScript**: Generally not required because TypeScript provides type information. Use JSDoc only for:
- Public APIs that need behavioral documentation
- Complex functions where types alone don't explain intent
- Deprecation notices

```typescript
// ❌ Redundant JSDoc (types already clear)
/**
 * @param name - The user's name
 * @returns The greeting string
 */
function greet(name: string): string { ... }

// ✅ Useful JSDoc (explains behavior, not types)
/**
 * Generates a quiz with the specified configuration.
 * Throws if the configuration is unsupported (e.g., too many letters for available data).
 */
function generateQuiz(mode: QuizMode): void { ... }

// ✅ Useful for deprecation
/** @deprecated Use `newFunction` instead */
function oldFunction() { ... }
```

---

*Last updated: 2026-01-01*
