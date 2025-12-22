import * as z from 'zod';
import {
  EDGE_SHAPES,
  HIERARCHY_DIRECTIONS,
  LAYOUT_MODES,
  VIEW_MODES,
} from '@/lib/constants';

const ViewModeSchema = z.enum(VIEW_MODES);
const LayoutModeSchema = z.enum(LAYOUT_MODES);
const HierarchyDirectionSchema = z.enum(HIERARCHY_DIRECTIONS);
const EdgeShapeSchema = z.enum(EDGE_SHAPES);
const EdgeStyleOptionsSchema = z.object({
  isFloating: z.boolean(),
  isAnimated: z.boolean(),
  shape: EdgeShapeSchema,
});

export type ViewMode = z.infer<typeof ViewModeSchema>;
export type LayoutMode = z.infer<typeof LayoutModeSchema>;
export type HierarchyDirection = z.infer<typeof HierarchyDirectionSchema>;
export type EdgeShape = z.infer<typeof EdgeShapeSchema>;
export type EdgeStyleOptions = z.infer<typeof EdgeStyleOptionsSchema>;
