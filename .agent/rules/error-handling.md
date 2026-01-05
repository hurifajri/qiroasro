---
trigger: always_on
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