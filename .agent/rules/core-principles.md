---
trigger: always_on
---

## 1. Core Principles

### KISS (Keep It Simple, Stupid)

- Prefer simple, readable solutions over clever ones
- If a solution needs extensive comments to explain, it's probably too complex
- Break down complex logic into smaller, focused functions

```typescript
// ❌ Too complex
const result = data.filter(x => x.active).map(x => ({ ...x, score: x.points * (x.bonus ? 1.5 : 1) })).sort((a, b) => b.score - a.score).slice(0, 10);

// ✅ Simple and readable
const activeItems = data.filter(item => item.active);
const withScores = activeItems.map(item => ({
  ...item,
  score: calculateScore(item),
}));
const topTen = sortByScoreDesc(withScores).slice(0, 10);
```

### DRY (Don't Repeat Yourself)

- Extract repeated logic into reusable functions, hooks, or components
- Create shared utilities in `src/lib/` for cross-cutting concerns
- Use constants for magic numbers and repeated strings

```typescript
// ❌ Repeated logic
// In component A
const supabase = getSupabaseClient();
const { data, error } = await supabase.from('letters').select('*').order('sort_order');
if (error) throw new Error(error.message);

// In component B (same pattern repeated)
const supabase = getSupabaseClient();
const { data, error } = await supabase.from('traits').select('*').order('sort_order');
if (error) throw new Error(error.message);

// ✅ DRY - create a generic service
async function fetchFromTable<T>(table: string, orderBy?: string): Promise<T[]> {
  const supabase = getSupabaseClient();
  let query = supabase.from(table).select('*');
  if (orderBy) query = query.order(orderBy);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as T[];
}
```

### SOLID Principles

#### S - Single Responsibility Principle
Each module/class/function should have one reason to change.

```typescript
// ❌ Multiple responsibilities
function UserCard({ user }) {
  // Fetching, formatting, and rendering all in one
  const [data, setData] = useState();
  useEffect(() => { fetch(...).then(setData) }, []);
  const formattedDate = new Date(data.date).toLocaleDateString('id-ID');
  return <div>{formattedDate}</div>;
}

// ✅ Separated responsibilities
// Hook for data fetching
function useUserData(userId: string) { ... }

// Utility for formatting
function formatDate(date: Date): string { ... }

// Component only for rendering
function UserCard({ user }: UserCardProps) { ... }
```

#### O - Open/Closed Principle
Open for extension, closed for modification.

```typescript
// ✅ Extensible node types without modifying core logic
const nodeTypes: NodeTypes = {
  letter: LetterNode,
  articulationArea: ArticulationAreaNode,
  articulationPoint: ArticulationPointNode,
  // Easy to add new types without changing existing code
  newType: NewTypeNode,
};
```

#### L - Liskov Substitution Principle
Subtypes must be substitutable for their base types.

#### I - Interface Segregation Principle
Prefer many specific interfaces over one large interface.

```typescript
// ❌ Large interface
interface QuizProps {
  mode: QuizMode;
  settings: QuizSettings;
  nodes: Node[];
  edges: Edge[];
  // ... 20 more props
}

// ✅ Segregated interfaces
interface QuizModeProps {
  mode: QuizMode;
}

interface QuizSettingsProps {
  settings: QuizSettings;
}

interface QuizGraphProps {
  nodes: Node[];
  edges: Edge[];
}
```

#### D - Dependency Inversion Principle
Depend on abstractions, not concretions.

```typescript
// ✅ Using dependency injection via props/context
interface UseQuizTimerOptions {
  duration: number;
  enabled: boolean;
  onTimeUp?: () => void;  // Callback abstraction
}
```

### YAGNI (You Aren't Gonna Need It)

- Don't add functionality until it's actually needed
- Avoid premature optimization
- Remove unused code and imports

```typescript
// ❌ Building for hypothetical future requirements
interface Letter {
  id: number;
  symbol: string;
  futureField1?: string;  // "We might need this later"
  futureField2?: number;  // "Just in case"
}

// ✅ Only what's needed now
interface Letter {
  id: number;
  symbol: string;
}
```

---