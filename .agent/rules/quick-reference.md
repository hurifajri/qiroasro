---
trigger: always_on
---

## 10. Quick Reference

### Do's ✅

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use descriptive variable names
- Keep components under 200 lines
- Use proper semantic HTML
- Test critical business logic
- Import global → page-level with absolute alias (`@/`)
- Import within same level with relative paths (`./`, `../`)

### Don'ts ❌

- Don't use `any` type
- Don't mutate state directly
- Don't use `// biome-ignore` without justification
- Don't ignore TypeScript errors with `@ts-ignore`
- Don't commit console.log (use proper logging)
- Don't hardcode strings (use i18n)
- Don't duplicate code across components
- Don't import from page-level to global

### Documentation

**JSDoc in TypeScript**: Generally not required because TypeScript provides type information. Use JSDoc only for:
- Public APIs that need behavioral documentation
- Complex functions where types alone don't explain intent
- Deprecation notices

```typescript
// ❌ Redundant JSDoc (types already clear)
/**
 * @param name - The user's name
 * @returns The greeting string
 */
function greet(name: string): string { ... }

// ✅ Useful JSDoc (explains behavior, not types)
/**
 * Generates a quiz with the specified configuration.
 * Throws if the configuration is unsupported (e.g., too many letters for available data).
 */
function generateQuiz(mode: QuizMode): void { ... }

// ✅ Useful for deprecation
/** @deprecated Use `newFunction` instead */
function oldFunction() { ... }
```

---