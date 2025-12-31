import type { HierarchyDirection, LayoutMode } from '@/schemas/graph';

/**
 * Base node data properties shared across all playground graph nodes.
 * Used for layout calculation and visual state management.
 */
export type BaseNodeData = {
  slug: string;
  isFloating?: boolean;
  layoutMode?: LayoutMode;
  hierarchyDirection?: HierarchyDirection;
  hasSourceEdge?: boolean;
  hasTargetEdge?: boolean;
  isHighlighted?: boolean;
  isConnectedToSelected?: boolean;
  isDimmed?: boolean;
};
