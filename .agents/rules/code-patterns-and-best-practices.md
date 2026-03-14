---
trigger: always_on
---

## Code Patterns and Best Practices

### Component Patterns

```typescript
// ✅ Proper Client Component structure
'use client';

import { useTranslations } from 'next-intl';
// Import types from related components if shared
import type { ChildComponentProps } from './child-component';

interface Props extends ChildComponentProps {
  // Additional props
}

export function ComponentName({ prop1, prop2 }: Props) {
  // Client Components use `useTranslations`
  const t = useTranslations('namespace');

  // 1. Hooks first
  const [state, setState] = useState();

  // 2. Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // 3. Derived state
  // ⚠️ Only use useMemo/memo/useCallback if computationally expensive or passed to memoized children. Avoid premature optimization!
  const derivedValue = useMemo(() => compute(state), [state]);

  // 4. Handlers
  // ⚠️ Only use useMemo/memo/useCallback if computationally expensive or passed to memoized children. Avoid premature optimization!
  const handleAction = useCallback(() => {
    // Logic
  }, [dependencies]);
  // Otherwise, use simple function
  function handleAction() {
    // Logic
  }

  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Page Component (Server Component) Pattern

```typescript
// ✅ Proper Page Component structure
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getPlaygroundDataOpt } from './_queries/playground';
import { ComponentProvider } from './_providers/component-provider';
import { Component } from './_components/component';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  // 1. Enable static rendering
  setRequestLocale(locale);

  // Server Components use `getTranslations`
  const t = await getTranslations({ locale, namespace: 'page.namespace' });

  // 2. Prefetch data if needed by client components (for useSuspenseQuery/useQuery)
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getPlaygroundDataOpt());

  // 3. Hydrate state & provide context
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h1 className="sr-only">{t('title')}</h1>
      <ComponentProvider>
        <Component />
      </ComponentProvider>
    </HydrationBoundary>
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

Transformers (`models/`) are **ONLY** required when dealing with REST API responses using `snake_case`, or when retrieving JSON data from a PostgreSQL Materialized View (`pgMaterializedView`) via Drizzle.
For standard Drizzle tables, Drizzle automatically maps columns to `camelCase` based on schema definition, so transformers are NOT needed.

```typescript
// ✅ Example 1: Drizzle direct table query (NO TRANSFORMER NEEDED)
// src/app/[locale]/(private)/_services/user-profile.ts
'use server';

import { db } from '@/lib/db';
import { userProfiles } from '@/db/user-schema';
import { parse } from 'valibot';
import { type UserProfile, UserProfileSchema } from '../_schemas/user-profile';
import { eq } from 'drizzle-orm';

export async function getUserProfileById(
  id: string,
): Promise<UserProfile | null> {
  try {
    const result = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.id, id))
      .limit(1);

    const remoteUserProfile = result[0];
    const userProfile = parse(UserProfileSchema, remoteUserProfile);

    return userProfile;
  } catch (error) {
    console.error('[getUserProfileById] Error:', error);
    return null;
  }
}
```

```typescript
// ✅ Example 2: Materialized View or REST API (TRANSFORMER REQUIRED)
// src/app/[locale]/(public)/playground/_services/playground.ts
'use server';

import { db } from '@/lib/db';
import { mvPlaygroundData } from '@/db/playground-schema';
import { parse } from 'valibot';
import { transformRemotePlaygroundData } from '../_models/playground';
import { RemotePlaygroundDataSchema } from '../_schemas/playground';

export async function getPlaygroundData(): Promise<PlaygroundData> {
  try {
    const result = await db
      .select({ data: mvPlaygroundData.data })
      .from(mvPlaygroundData);
    const data = result[0]?.data;

    const remoteData = parse(RemotePlaygroundDataSchema, data);
    const playgroundData = transformRemotePlaygroundData(remoteData);

    return playgroundData;
  } catch (error) {
    console.error('[getPlaygroundData] Error:', error);
    return {
      letters: [],
      articulationAreas: [],
      articulationPoints: [],
      traitGroups: [],
      traits: [],
      letterArticulations: [],
      letterTraits: [],
    };
  }
}
```

#### Pattern: Remote API → Local Types (When Transformers Are Required)

External APIs return data in `snake_case` (e.g., `letter_name`, `sort_order`). Local types use `camelCase` (e.g., `letterName`, `sortOrder`).

**Step 1: Define Remote Schema** (prefix with `Remote`)

```typescript
import { object, number, string, type InferOutput } from 'valibot';

// Remote types match API response exactly (snake_case)
export const RemoteLetterSchema = object({
  id: number(),
  letter_name: string(),
  sort_order: number(),
});

export type RemoteLetter = InferOutput<typeof RemoteLetterSchema>;
```

**Step 2: Define Local Type** (camelCase)

```typescript
// Local types use camelCase for consistency with validation schema
export const LetterSchema = object({
  id: number(),
  letterName: pipe(
    string(),
    minLength(3, 'username_min_length'),
    maxLength(30, 'username_max_length')
  ),
  sortOrder: number(),
});

export type Letter = InferOutput<typeof LetterSchema>;
```

**Step 3: Create Transformation Function**

```typescript
// Transform from Remote to Local
export function transformRemoteLetter(remote: RemoteLetter): Letter {
  return {
    id: remote.id,
    letterName: remote.letter_name,
    sortOrder: remote.sort_order,
  };
}
```

#### File Organization (For External APIs)

- **Schemas:** `src/schemas/entity.ts` — Valibot schemas (Remote + Local types)
- **Transformers:** `src/models/entity.ts` — `transformRemote*` functions
- **Services:** `src/services/entity.ts` — Fetch + validate + transform

#### Anti-Patterns

```typescript
// ❌ Using API data directly without validation
const letters = await fetch('/api/letters').then(r => r.json()); // Untyped!

// ❌ Partial transformation
return { id: remote.id, letterName: remote.letter_name }; // Inconsistent

// ✅ Full validation + transformation
const parsed = parse(RemoteLetterSchema, remoteLetter);
return transformRemoteLetter(parsed);
```

### Query Options Pattern

```typescript
// queries/entity.ts
const entityKeys = {
  all: ['entities'],
  list: () => [...entityKeys.all, 'list'],
  detail: (id: number) => [...entityKeys.all, 'detail', id],
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
Constants should generally be co-located with the files/features that need them most, rather than accumulating in a single massive `constants.ts` file.
Combine related types and constants in the same file where applicable to improve locality.
Only truly global constants that span multiple disjoint domains should live in `src/lib/constants.ts` or `src/lib/config.ts`.

```typescript
// ✅ Good: Co-located constants in module or component folder
// src/app/[locale]/(public)/playground/_lib/constants.ts

export const PLAYGROUND_STORE_KEY = 'playground_store';
export const VIEW_MODES = ['all', 'filter', 'search'] as const;
export type ViewMode = (typeof VIEW_MODES)[number];

export const QUIZ_CONFIG = {
  MIN_QUESTIONS: 1,
  MAX_QUESTIONS: 10,
  DEFAULT_TIMER: 30,
} as const;
```

### Environment Variables Pattern

```typescript
// src/env.ts
import { createEnv } from '@t3-oss/env-nextjs';
import { minLength, pipe, string, url } from 'valibot';

export const env = createEnv({
  server: {
    DATABASE_URL: pipe(string(), minLength(1)),
  },
  client: {
    NEXT_PUBLIC_APP_URL: pipe(string(), url(), minLength(1)),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
```

### Styling Pattern

```typescript
// ✅ Use cn() for class merging and conditional classes
import { cn } from '@/lib/utils';

export function Component({ className, isError }: Props) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md border p-4', // Base classes
        'bg-white dark:bg-zinc-950', // Theming
        isError && 'border-red-500 bg-red-50', // Conditional classes
        className, // Prop overrides
      )}
    >
      Content
    </div>
  );
}
```

---