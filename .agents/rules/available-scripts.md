---
trigger: always_on
---

## Available Scripts

All commands should be run with `pnpm`:

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js development server |
| `pnpm build` | Build production bundle |
| `pnpm start` | Start production server |
| `pnpm check` | Run Biome linter & apply safe fixes |
| `pnpm fix` | Run unsafe Biome fixes (--write mode) |
| `pnpm check:types` | TypeScript type checking (no emit) |
| `pnpm check:packages` | Check for outdated packages |
| `pnpm build:analyze` | Analyze production bundle |

### Common Workflows

```bash
# Before committing
pnpm check          # Lint + format
pnpm check:types    # Type check

# Start development
pnpm dev

# Production build
pnpm build
pnpm start
```

---