import type { EDGE_SHAPES, VIEW_MODES } from '@/lib/constants';

// Types derived from constants
export type EdgeShape = (typeof EDGE_SHAPES)[number];
export type ViewMode = (typeof VIEW_MODES)[number];

// Graph/Edge TypeScript types
export interface EdgeStyleOptions {
  isFloating: boolean;
  isAnimated: boolean;
  shape: EdgeShape;
}
