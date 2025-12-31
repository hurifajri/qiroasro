import * as z from 'zod';
import {
  HIERARCHY_DIRECTIONS,
  LAYOUT_MODES,
  QUIZ_MODES,
  QUIZ_STATUSES,
  VIEW_MODES,
} from '@/lib/constants';

const HierarchyDirectionSchema = z.enum(HIERARCHY_DIRECTIONS);
const LayoutModeSchema = z.enum(LAYOUT_MODES);
const ViewModeSchema = z.enum(VIEW_MODES);
const QuizModeSchema = z.enum(QUIZ_MODES);
export const QuizStatusSchema = z.enum(QUIZ_STATUSES);

export type HierarchyDirection = z.infer<typeof HierarchyDirectionSchema>;
export type LayoutMode = z.infer<typeof LayoutModeSchema>;
export type ViewMode = z.infer<typeof ViewModeSchema>;
export type QuizMode = z.infer<typeof QuizModeSchema>;
export type QuizStatus = z.infer<typeof QuizStatusSchema>;
