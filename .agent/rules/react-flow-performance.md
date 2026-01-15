---
trigger: always_on
---

## 10. React Flow Performance

React Flow can suffer from performance issues on mobile devices, especially during zoom + click interactions. Follow these guidelines to optimize performance.

### Memoize Components

All custom node and edge components must be wrapped with `React.memo()` to prevent unnecessary re-renders during zoom/pan operations.

```typescript
// ✅ Memoized node component
import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';

export const LetterNode = memo(function LetterNode({ data, selected }: NodeProps) {
  // Component implementation
});

// ❌ Non-memoized (causes re-renders on every zoom/pan)
export function LetterNode({ data, selected }: NodeProps) {
  // Component implementation
}
```

### Memoize Static Objects

Define `nodeTypes` and `edgeTypes` outside the component, or memoize them:

```typescript
// ✅ Defined outside component (preferred)
const nodeTypes: NodeTypes = {
  letter: LetterNode,
  articulationArea: ArticulationAreaNode,
};

const edgeTypes: EdgeTypes = {
  floating: FloatingEdge,
};

export function Playground() {
  return <ReactFlow nodeTypes={nodeTypes} edgeTypes={edgeTypes} />;
}
```

### Memoize Props Objects

Objects and arrays passed as props should be memoized:

```typescript
// ✅ Memoized props
const defaultEdgeOptions = useMemo(
  () => ({
    type: computedEdgeType,
    animated: edgeStyle.isAnimated,
  }),
  [computedEdgeType, edgeStyle.isAnimated],
);

return <ReactFlow defaultEdgeOptions={defaultEdgeOptions} />;

// ❌ Inline object (creates new reference every render)
return (
  <ReactFlow
    defaultEdgeOptions={{
      type: computedEdgeType,
      animated: edgeStyle.isAnimated,
    }}
  />
);
```

### Performance Checklist

- [ ] All custom node components wrapped with `React.memo()`
- [ ] All custom edge components wrapped with `React.memo()`
- [ ] `nodeTypes` and `edgeTypes` defined outside component
- [ ] `defaultEdgeOptions` memoized with `useMemo`
- [ ] Handler functions memoized with `useCallback`
- [ ] Avoid accessing entire `nodes`/`edges` arrays in child components
- [ ] Simplify complex CSS (shadows, gradients, blur) if performance issues persist

### Reference

- [React Flow Performance Guide](https://reactflow.dev/learn/advanced-use/performance)

---