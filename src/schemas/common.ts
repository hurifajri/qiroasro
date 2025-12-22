import * as z from 'zod';
import {
  HIERARCHY_DIRECTIONS,
  LAYOUT_MODES,
  VIEW_MODES,
} from '@/lib/constants';

const HierarchyDirectionSchema = z.enum(HIERARCHY_DIRECTIONS);
const LayoutModeSchema = z.enum(LAYOUT_MODES);
const ViewModeSchema = z.enum(VIEW_MODES);

export type HierarchyDirection = z.infer<typeof HierarchyDirectionSchema>;
export type LayoutMode = z.infer<typeof LayoutModeSchema>;
export type ViewMode = z.infer<typeof ViewModeSchema>;
