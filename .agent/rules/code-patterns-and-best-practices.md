---
trigger: always_on
---

## Code Patterns and Best Practices

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
'use server'; // ✅ Server Action

import { parse } from 'valibot';
import { db } from '@/lib/db';
import { entities } from '@/db/schema';
import { RemoteEntitySchema, type Entity } from '@/schemas/entity';
import { transformRemoteEntity } from '@/models/entity';

export async function getEntities(): Promise<Entity[]> {
  try {
    // Drizzle queries run on the server
    const result = await db.select().from(entities).orderBy(entities.sortOrder);

    // Validate and transform
    return result.map(item => {
      const remote = parse(RemoteEntitySchema, item);
      return transformRemoteEntity(remote);
    });
  } catch (error) {
    console.error('Failed to fetch entities:', error);
    return []; // Return empty or throw based on requirements
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

### Environment Variables Pattern

```typescript
// src/env.ts
import { createEnv } from '@t3-oss/env-nextjs';
import { minLength, pipe, string, url } from 'valibot';

export const env = createEnv({
  server: {
    DATABASE_URL: pipe(string(), minLength(1)),
    RESEND_API_KEY: pipe(string(), minLength(1)),
  },
  client: {
    NEXT_PUBLIC_APP_URL: pipe(string(), url(), minLength(1)),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
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