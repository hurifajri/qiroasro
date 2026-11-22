import type { HierarchyDirection, LayoutMode } from './graph';

export const NODE_TYPES = [
  'letter',
  'articulation_area',
  'articulation_point',
  'trait_group',
  'trait',
] as const;

/**
 * Base node data properties shared across all tajweed graph nodes.
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
  isDimmed?: boolean;
  isInteractive?: boolean;
};
