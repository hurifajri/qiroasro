---
trigger: always_on
---

## Code Style & Formatting

### Biome Configuration

The project uses **Biome** for linting and formatting. All code must adhere to these settings:

| Setting | Value | Notes |
|---------|-------|-------|
| **Line Width** | 80 characters | Hard limit for readability |
| **Indentation** | 2 spaces (space style) | No tabs. LF line endings only |
| **Quotes (JavaScript)** | Single quotes `'` | Cleaner for code |
| **Quotes (JSX)** | Double quotes `"` | JSX attributes use double quotes |
| **Trailing Commas** | All (except JSON) | Cleaner diffs, easier refactoring |
| **Semicolons** | Always required | Explicit, avoids ASI edge cases |

### TypeScript Configuration

The project uses strict TypeScript to catch errors at compile time:

| Setting | Value | Notes |
|---------|-------|-------|
| **Compilation Target** | ES2017 | Modern JavaScript with good browser support |
| **Strict Mode** | Enabled | All strict flags enabled (`noImplicitAny`, `strictNullChecks`, etc.) |
| **Module Resolution** | Bundler | Next.js compatible module resolution |
| **Path Alias** | `@/*` → `./src/*` | Absolute imports for clarity |
| **Babel React Compiler** | Enabled | Auto-memoization for performance optimization |

### Before Committing

Always verify code style before creating a commit:

```bash
pnpm check          # Run Biome linter + safe auto-fixes
pnpm check:types    # TypeScript type checking (no emit)
```

If `pnpm check` fails, use `pnpm fix` to apply unsafe fixes:

```bash
pnpm fix            # Run Biome with --write --unsafe mode
```

---
