import * as z from 'zod';
import { HIERARCHY_DIRECTIONS, LAYOUT_MODES } from '@/lib/constants';

const HierarchyDirectionSchema = z.enum(HIERARCHY_DIRECTIONS);
const LayoutModeSchema = z.enum(LAYOUT_MODES);

export type HierarchyDirection = z.infer<typeof HierarchyDirectionSchema>;
export type LayoutMode = z.infer<typeof LayoutModeSchema>;
