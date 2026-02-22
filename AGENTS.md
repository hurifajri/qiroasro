# AGENTS.md - Qiroasro Development Guide

This guide documents essential information for agentic developers working on the qiroasro project.

## 1. Build & Deployment Commands

All commands use **pnpm** (not npm/yarn).

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start Next.js dev server (port 3000) |
| `pnpm build` | Build production bundle |
| `pnpm start` | Start production server |
| `pnpm check` | Run Biome linting + safe fixes |
| `pnpm fix` | Run unsafe Biome fixes (--write mode) |
| `pnpm check:types` | TypeScript type checking (no emit) |

**Before Committing:**
```bash
pnpm check          # Lint & format
pnpm check:types    # Type check
```

## 2. Code Style & Formatting

### Biome Configuration
- **Line Width:** 80 characters
- **Indentation:** 2 spaces (space style, LF line endings)
- **Quotes:** Single quotes for JS, double for JSX
- **Trailing Commas:** All (except JSON)
- **Semicolons:** Always required

### TypeScript Configuration
- **Target:** ES2017
- **Strict Mode:** Enabled (strict type checking)
- **Module Resolution:** Bundler (Next.js compatible)
- **Path Alias:** `@/*` → `./src/*`
- **Babel React Compiler:** Enabled (auto-memoization)

## 3. Naming Conventions

### Files & Directories
| Type | Convention | Example |
|------|------------|---------|
| Components | `kebab-case.tsx` | `quiz-settings.tsx` |
| Hooks | `use-*.ts` | `use-quiz-timer.ts` |
| Utilities | `kebab-case.ts` | `graph-helpers.ts` |
| Types/Schemas | `kebab-case.ts` | `quiz.ts` |

### Code Elements
| Type | Convention | Example |
|------|------------|---------|
| Components | `PascalCase` | `QuizSettings` |
| Functions | `camelCase` | `handleSubmit` |
| Boolean vars | `is`/`has`/`should` prefix | `isLoading`, `hasError` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_RETRIES` |
| Types/Interfaces | `PascalCase` | `QuizState` |
| Zustand Stores | `PascalCase` + `Store` | `QuizStore` |
| Valibot Schemas | `PascalCase` + `Schema` | `LetterSchema` |

## 4. Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/           # Internationalization
│   ├── (public)/           # Public routes group
│   └── api/                # API routes
├── components/
│   ├── common/             # Shared components
│   ├── ui/                 # shadcn/ui primitives
│   └── graph/              # React Flow components
├── hooks/                  # Global custom hooks
├── lib/                    # Global utilities (cn, db, resend, etc.)
├── providers/              # Global React providers
├── stores/                 # Zustand global stores
├── db/                     # Drizzle database schema
├── i18n/                   # i18n configuration
├── schemas/                # Global Valibot schemas
└── styles/                 # Global CSS
```

## 5. Import Rules

### Hierarchy (from global → page-specific)

```typescript
// ✅ Global to page-level (allowed)
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// ✅ Within same level (relative imports)
import { QuizCanvas } from './quiz-canvas';
import { useQuizStore } from '../stores/quiz';

// ❌ Page-level to global (FORBIDDEN)
import { something } from '@/app/(public)/playground/lib/graph';
```

**React Flow Special Rule:** Always import from `@/components/graph/` not `@xyflow/react` components (except types/hooks).

## 6. Component Patterns

### Functional Component Structure
```typescript
'use client';  // Mark client components

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { ComponentProps } from './types';

interface Props extends ComponentProps {
  prop1: string;
}

export function ComponentName({ prop1, prop2 }: Props) {
  const t = useTranslations();

  // 1. Hooks (useState, useQuery, etc.)
  // 2. Derived state (useMemo)
  // 3. Effects (useEffect)
  // 4. Handlers (useCallback)
  // 5. Render (JSX)

  return <div className={cn('base-class', prop1 && 'conditional')} />;
}
```

### Styling with Tailwind & cn()
```typescript
import { cn } from '@/lib/utils';

// ✅ Use cn() for conditional classes
className={cn(
  'base-class',
  isActive && 'active:bg-blue-500',
  variant === 'primary' && 'bg-primary'
)}

// ✅ Biome sorts class names with useSortedClasses rule
className={cn('bg-blue-500 text-white')}  // Auto-sorted
```

## 7. State Management (Zustand)

### Store Pattern
```typescript
interface QuizState {
  isOpen: boolean;
  mode: QuizMode | null;
}

interface QuizActions {
  openDialog: () => void;
  closeDialog: () => void;
  setMode: (mode: QuizMode) => void;
}

export type QuizStore = QuizState & QuizActions;

export function createQuizStore() {
  return createStore<QuizStore>()((set) => ({
    isOpen: false,
    mode: null,
    openDialog: () => set({ isOpen: true }),
    closeDialog: () => set({ isOpen: false }),
    setMode: (mode) => set({ mode }),
  }));
}
```

### Usage in Components
```typescript
// ✅ Granular selectors (only subscribe to needed values)
const isOpen = useQuizStore(s => s.isOpen);
const openDialog = useQuizStore(s => s.openDialog);

// ❌ Avoid subscribing to entire store
const store = useQuizStore(s => s);  // Re-renders on any change
```

## 8. Error Handling

### Server Actions (use server)
```typescript
'use server';

export async function getLetters(): Promise<Letter[]> {
  try {
    return await db.select().from(letters).orderBy(letters.sortOrder);
  } catch (error) {
    console.error('[getLetters] DB Error:', error);
    throw new Error('Failed to fetch letters from database');
  }
}
```

### Component Error Handling
```typescript
function LetterList() {
  const { data, error, isLoading } = useQuery(getLettersOpt());

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!data?.length) return <EmptyState />;

  return <List items={data} />;
}
```

### Never Use These Patterns
- ❌ `as any` type assertions
- ❌ `@ts-ignore` comments
- ❌ Empty catch blocks
- ❌ Unhandled promise rejections

## 9. Constants Pattern

```typescript
// lib/constants.ts

// Storage keys
export const GLOBAL_STORE_KEY = 'qiroasro_global-store';

// Enum-like (use `as const` for type inference)
export const VIEW_MODES = ['all', 'filter', 'search'] as const;
export type ViewMode = (typeof VIEW_MODES)[number];

// Configuration objects
export const QUIZ_CONFIG = {
  MIN_QUESTIONS: 1,
  MAX_QUESTIONS: 10,
  DEFAULT_TIMER: 30,
} as const;
```

## 10. Data Transformation (Schemas)

Use **Valibot** for runtime schema validation:
```typescript
import * as v from 'valibot';

// Remote API types (snake_case) - prefix with Remote
export const RemoteLetterSchema = v.object({
  id: v.number(),
  letter_name: v.string(),
});

// Local types (camelCase) - transformed from Remote
export type LocalLetter = {
  id: number;
  letterName: string;
};

// Transformation function
export function transformRemoteLetter(remote: RemoteLetter): LocalLetter {
  return {
    id: remote.id,
    letterName: remote.letter_name,
  };
}
```

## 11. React Query Patterns

### Query Keys Factory
```typescript
const entityKeys = {
  all: ['entities'] as const,
  list: () => [...entityKeys.all, 'list'] as const,
  detail: (id: number) => [...entityKeys.all, 'detail', id] as const,
};

export function getEntitiesOpt() {
  return queryOptions({
    queryKey: entityKeys.list(),
    queryFn: () => getEntities(),
    staleTime: 5 * 60 * 1000,  // 5 min cache
  });
}
```

## 12. Type Safety

- ✅ **Always use strict types** - avoid `any`, `unknown` without assertion
- ✅ **Use `type` for types, `interface` for objects** (guidelines preference)
- ✅ **Document complex types** with JSDoc comments
- ❌ **Never suppress type errors** - fix the root cause

## 13. Accessibility (WCAG 2.1 AA)

- [ ] Every page has `<h1>` (can be `sr-only`)
- [ ] Images have meaningful `alt` text
- [ ] Form inputs have `<label>` elements
- [ ] Buttons have accessible names (text or `aria-label`)
- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Interactive elements are keyboard accessible
- [ ] Focus states are visible

## 14. SEO Metadata

Every page.tsx must export generateMetadata:
```typescript
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('page.metadata');
  const locale = await getLocale();

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: '/page-path',
      languages: { id: '/id/page-path', en: '/en/page-path' },
    },
  };
}
```

## 15. Code Quality Principles

### KISS (Keep It Simple, Stupid)
- Prefer readable solutions over clever ones
- Break complex logic into smaller functions
- If it needs extensive comments, refactor it

### DRY (Don't Repeat Yourself)
- Extract repeated logic into reusable functions
- Use `src/lib/` for cross-cutting concerns
- Create constants for magic numbers/strings

### SOLID Principles
- **S:** Each module has one reason to change
- **O:** Extensible, closed for modification
- **L:** Subtypes substitutable for base types
- **I:** Specific interfaces over large ones
- **D:** Depend on abstractions, not concretions

---
