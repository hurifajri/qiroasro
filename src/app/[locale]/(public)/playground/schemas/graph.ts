import type {
  EDGE_SHAPES,
  HIERARCHY_DIRECTIONS,
  LAYOUT_MODES,
  VIEW_MODES,
} from '../lib/constants';

// Types derived from constants
export type HierarchyDirection = (typeof HIERARCHY_DIRECTIONS)[number];
export type LayoutMode = (typeof LAYOUT_MODES)[number];
export type EdgeShape = (typeof EDGE_SHAPES)[number];
export type ViewMode = (typeof VIEW_MODES)[number];

// Graph/Edge TypeScript types
export interface EdgeStyleOptions {
  isFloating: boolean;
  isAnimated: boolean;
  shape: EdgeShape;
}
