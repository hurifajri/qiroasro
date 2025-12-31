import * as z from 'zod';
import { EDGE_SHAPES, QUIZ_MODES, QUIZ_STATUSES, VIEW_MODES } from '@/lib/constants';

const EdgeShapeSchema = z.enum(EDGE_SHAPES);
const EdgeStyleOptionsSchema = z.object({
  isFloating: z.boolean(),
  isAnimated: z.boolean(),
  shape: EdgeShapeSchema,
});
const ViewModeSchema = z.enum(VIEW_MODES);
const QuizModeSchema = z.enum(QUIZ_MODES);
export const QuizStatusSchema = z.enum(QUIZ_STATUSES);

export type EdgeShape = z.infer<typeof EdgeShapeSchema>;
export type EdgeStyleOptions = z.infer<typeof EdgeStyleOptionsSchema>;
export type ViewMode = z.infer<typeof ViewModeSchema>;
export type QuizMode = z.infer<typeof QuizModeSchema>;
export type QuizStatus = z.infer<typeof QuizStatusSchema>;
