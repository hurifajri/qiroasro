---
trigger: always_on
---

## 4. State Management

### Store Structure

```typescript
// 1. Define State interface
interface QuizState {
  isDialogOpen: boolean;
  mode: QuizMode | null;
  settings: QuizSettingsValues;
}

// 2. Define Actions interface
interface QuizActions {
  openDialog: () => void;
  closeDialog: () => void;
  setMode: (mode: QuizMode | null) => void;
}

// 3. Combine as Store type
export type QuizStore = QuizState & QuizActions;

// 4. Define initial state
const initialState: QuizState = {
  isDialogOpen: false,
  mode: null,
  settings: DEFAULT_QUIZ_SETTINGS,
};

// 5. Create store
export function createQuizStore() {
  return createStore<QuizStore>()((set) => ({
    ...initialState,
    openDialog: () => set({ isDialogOpen: true }),
    closeDialog: () => set({ isDialogOpen: false }),
    setMode: (mode) => set({ mode }),
  }));
}
```

### Provider Pattern

```typescript
'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

type StoreApi = ReturnType<typeof createStore>;
const StoreContext = createContext<StoreApi | undefined>(undefined);

export function StoreProvider({ children }: React.PropsWithChildren) {
  const storeRef = useRef<StoreApi>(undefined);
  storeRef.current ??= createStore();

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
}

export function useAppStore<T>(selector: (store: Store) => T): T {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within StoreProvider');
  }
  return useStore(context, selector);
}
```

### Best Practices

1. **Avoid useState when Zustand store exists**:
   ```typescript
   // ❌ Duplicating store state with useState
   const [isStarted, setIsStarted] = useState(false);

   // ✅ Use store directly
   const isStarted = useQuizStore(s => s.isStarted);
   const startQuiz = useQuizStore(s => s.startQuiz);
   ```

2. **Use granular selectors for performance**:
   ```typescript
   // ❌ Subscribes to entire store
   const store = useQuizStore(s => s);

   // ✅ Only subscribes to specific value
   const isStarted = useQuizStore(s => s.isStarted);
   const startQuiz = useQuizStore(s => s.startQuiz);

   // ✅ Or use shallow selector for performance
   import { useShallow } from 'zustand/react/shallow';
   const { isStarted, startQuiz } = useQuizStore(
     useShallow((s) => ({
       isStarted: s.isStarted,
       startQuiz: s.startQuiz,
     }))
   );
   ```

3. **Group related actions**:
   ```typescript
   // Group by domain
   // Dialog actions
   openDialog: () => set({ isDialogOpen: true }),
   closeDialog: () => set({ isDialogOpen: false }),

   // Quiz actions
   startQuiz: () => set({ isStarted: true }),
   resetQuiz: () => set({ ...initialQuizState }),
   ```

---