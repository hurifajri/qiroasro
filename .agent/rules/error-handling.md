---
trigger: always_on
---

## 7. Error Handling

### Service Layer

```typescript
// ✅ Proper error handling for Server Actions
'use server';

export async function getLetters(): Promise<Letter[]> {
  try {
    return await db.select().from(letters).orderBy(letters.sortOrder);
  } catch (error) {
    console.error('[getLetters] DB Error:', error);
    // Throw error or safe fallback depending on requirement
    throw new Error('Failed to fetch letters from database');
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