---
trigger: always_on
---

## Project Organization

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes group
│   │   ├── components/    # Page-specific components
│   │   ├── hooks/         # Page-specific hooks
│   │   ├── lib/           # Page-specific utilities
│   │   ├── models/        # Data transformers
│   │   ├── providers/     # React context providers
│   │   ├── queries/       # TanStack Query options
│   │   ├── schemas/       # Valibot schemas & types
│   │   ├── services/      # API/data services
│   │   └── stores/        # Zustand stores
│   └── api/               # API routes
├── components/
│   ├── common/            # Shared components
│   ├── ui/                # UI primitives (shadcn/ui)
│   └── [feature]/         # Feature-specific shared components
├── db/                    # Database schema and migrations
├── hooks/                 # Global hooks
├── i18n/                  # Internationalization configuration
├── lib/                   # Global utilities
├── models/                # Global data transformers
├── providers/             # Global providers
├── queries/               # Global query options
├── schemas/               # Global schemas
├── services/              # Global services
├── stores/                # Global stores
├── styles/                # Global styles
├── types/                 # Global type definitions
└── env.ts                 # Environment variables definition
```

### Placement Rules

1. **Global vs Feature-specific**:
   - If used across multiple features → Global (`src/[folder]/`)
   - If used only in one feature → Feature-specific (`src/app/[route]/[folder]/`)

2. **Schema Organization**:
   - Remote types (snake_case from API): Defined with `Remote` prefix
   - Local types (camelCase): Transformed from Remote types
   - Keep related types together in one schema file

3. **Avoid Duplicate Names**:
   - If same filename exists in global and feature-specific, add context
   - Example: `graph-layout.ts` (global) vs `graph-generator.ts` (feature)

### Import Rules

```typescript
// ❌ NEVER import from page-level to global
// Global files should never depend on page-specific code
import { something } from '@/app/(public)/playground/lib/graph'; // ❌ NO!

// ✅ Import from global to page-level (absolute import alias)
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Letter } from '@/schemas/letter';

// ✅ Import within same page-level (relative import)
// Inside src/app/(public)/playground/components/quiz.tsx
import { useQuizStore } from '../providers/quiz';
import type { QuizType } from '../schemas/quiz';
import { QuizCanvas } from './quiz-canvas';

// ✅ Import within same global level (relative import)
// Inside src/lib/utils.ts
import { GLOBAL_CONSTANTS } from './constants';
```

| From | To | Import Style |
|------|----|--------------|
| Global | Page-level | ❌ Never allowed |
| Page-level | Global | ✅ Absolute alias (`@/`) |
| Page-level | Same page-level | ✅ Relative (`../` or `./`) |
| Global | Same global | ✅ Relative (`./`) |

### Graph Import Rules

For React Flow (xyflow) components, **always import from `@/components/graph/`** instead of directly from `@xyflow/react`. This ensures:
- Consistent styling across the application
- Centralized customization of base components
- Easier maintenance and updates

```typescript
// ❌ NEVER import directly from xyflow
import { Handle, BaseEdge } from '@xyflow/react'; // ❌ NO!

// ✅ Import from graph components
import { BaseHandle } from '@/components/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/graph/base-node';
import { FloatingEdge } from '@/components/graph/floating-edge';
import { FloatingConnectionLine } from '@/components/graph/floating-connection-line';

// ✅ Types and hooks can still be imported from xyflow
import type { NodeProps, Edge, Node, EdgeTypes } from '@xyflow/react';
import { useReactFlow, useNodesState, useEdgesState } from '@xyflow/react';
```

| Component Type | Import From |
|----------------|-------------
| Handle | `@/components/graph/base-handle` |
| Node Base | `@/components/graph/base-node` |
| Edge | `@/components/graph/floating-edge` |
| Connection Line | `@/components/graph/floating-connection-line` |
| Types & Hooks | `@xyflow/react` (allowed) |

---