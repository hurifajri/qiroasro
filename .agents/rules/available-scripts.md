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
| `pnpm check` | Run Biome linter & format (check only) |
| `pnpm fix` | Run unsafe Biome fixes (--write mode, lint and format) |
| `pnpm check:types` | TypeScript type checking (no emit) |
| `pnpm check:packages` | Check for outdated packages |
| `pnpm build:analyze` | Analyze production bundle |

### Common Workflows

```bash
# Before committing
pnpm check          # Check lint + format
pnpm check:types    # Type check
pnpm fix            # Fix lint + format

# Start development
pnpm dev

# Production build
pnpm build
pnpm start
```

---