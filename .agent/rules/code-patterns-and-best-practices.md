---
trigger: always_on
---

## 5. Code Patterns and Best Practices

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