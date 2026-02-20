---
trigger: always_on
---

## Type Safety

TypeScript strict mode is enforced. All code must be type-safe with explicit, not inferred, types.

### Strict Types (No `any`)

**Never suppress types with `any` or `unknown` without explicit assertion:**

```typescript
// ❌ Avoid
const data: any = apiResponse;  // Loses all type info

// ❌ Avoid (especially in callbacks)
const handler = (e: any) => console.log(e);

// ✅ Use explicit types
const data: Letter[] = apiResponse;

// ✅ Type guards for uncertain data
function isLetter(x: unknown): x is Letter {
  return typeof x === 'object' && x !== null && 'id' in x;
}
```

### `type` vs `interface`

Use **`type`** for type aliases. Use **`interface`** for object shapes that need extension.

```typescript
// ✅ Use type for unions, primitives, tuples
export type QuizMode = 'practice' | 'test' | 'review';
export type Coordinate = [number, number];
export type Result = Success | Error;

// ✅ Use interface for object shapes (especially if extended)
export interface Button {
  label: string;
  onClick: () => void;
}

export interface PrimaryButton extends Button {
  variant: 'primary';
}

// ⚠️ If only defining a shape once, either works
type SimpleObject = { id: number; name: string };
interface SimpleObject { id: number; name: string }
```

### JSDoc for Complex Types

Include JSDoc **only** for complex functions, public APIs, or non-obvious behavior. Don't duplicate type information:

```typescript
// ❌ Redundant JSDoc (types are clear)
/**
 * @param name - The name
 * @returns A greeting string
 */
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// ✅ Useful JSDoc (explains non-obvious behavior)
/**
 * Generates a randomized quiz from available letters.
 * Throws if the requested question count exceeds available letters.
 * @throws {Error} If questionCount > availableLetters
 */
function generateQuiz(mode: QuizMode, questionCount: number): Quiz {
  // Implementation
}
```

### Never Suppress Type Errors

**Always fix the root cause. Never use:**
- ❌ `as any` type assertions
- ❌ `@ts-ignore` comments
- ❌ `@ts-expect-error` without explanation
- ❌ `!` non-null assertion without justification

```typescript
// ❌ Type suppression (hides real bugs)
const data = apiResponse as any;
const value = obj.field!;  // Unsafe

// ✅ Fix the root cause
const data: Letter[] = parse(LetterSchema, apiResponse);
const value = obj.field ?? fallbackValue;

// ✅ Non-null assertion only with clear justification
// @ts-expect-error - ref is assigned in useEffect before render
const input = ref.current!;
```

---
