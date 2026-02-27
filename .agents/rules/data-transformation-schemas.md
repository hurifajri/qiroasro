---
trigger: always_on
---

## Data Transformation & Schemas

All data from external APIs must be validated and transformed into local types using **Valibot** for runtime schema validation.

### Pattern: Remote → Local Types

External APIs return data in `snake_case` (e.g., `letter_name`, `sort_order`). Local types use `camelCase` (e.g., `letterName`, `sortOrder`).

**Step 1: Define Remote Schema** (prefix with `Remote`)

```typescript
import * as v from 'valibot';

// Remote types match API response exactly (snake_case)
export const RemoteLetterSchema = v.object({
  id: v.number(),
  letter_name: v.string(),
  sort_order: v.number(),
});

export type RemoteLetter = v.InferOutput<typeof RemoteLetterSchema>;
```

**Step 2: Define Local Type** (camelCase)

```typescript
// Local types use camelCase for consistency
export type Letter = {
  id: number;
  letterName: string;
  sortOrder: number;
};
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

### Usage in Services

```typescript
'use server';

import { parse } from 'valibot';
import { db } from '@/lib/db';
import { letters } from '@/db/schema';
import { RemoteLetterSchema, transformRemoteLetter } from '@/schemas/letter';

export async function getLetters(): Promise<Letter[]> {
  try {
    const result = await db.select().from(letters).orderBy(letters.sortOrder);
    
    // Validate and transform each item
    return result.map(item => {
      const remote = parse(RemoteLetterSchema, item);
      return transformRemoteLetter(remote);
    });
  } catch (error) {
    console.error('[getLetters] Error:', error);
    throw new Error('Failed to fetch letters');
  }
}
```

### File Organization

- **Schemas:** `src/schemas/entity.ts` — Valibot schemas (Remote + Local types)
- **Transformers:** `src/models/entity.ts` — `transformRemote*` functions
- **Services:** `src/services/entity.ts` — Fetch + validate + transform

### Anti-Patterns

```typescript
// ❌ Using API data directly without validation
const letters = await fetch('/api/letters').then(r => r.json()); // Untyped!

// ❌ Partial transformation
return { id: remote.id, letterName: remote.letter_name }; // Inconsistent

// ✅ Full validation + transformation
const validated = parse(RemoteLetterSchema, apiData);
return transformRemoteLetter(validated);
```

---
