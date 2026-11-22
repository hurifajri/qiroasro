// Graph Constants
export const VIEW_MODES = ['letter', 'all'] as const;
export const LAYOUT_MODES = ['hierarchical', 'radial'] as const;
export const HIERARCHY_DIRECTIONS = ['horizontal', 'vertical'] as const;
export const EDGE_SHAPES = [
  'default',
  'straight',
  'step',
  'smoothstep',
] as const;

// Query param keys
export const PARAM_VIEW = 'view';
export const PARAM_LAYOUT = 'layout';
export const PARAM_DIRECTION = 'direction';
export const PARAM_SHAPE = 'shape';
export const PARAM_LETTER = 'letter';

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
