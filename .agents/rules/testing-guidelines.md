---
trigger: always_on
---

## Testing Guidelines

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