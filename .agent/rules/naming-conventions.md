---
trigger: always_on
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