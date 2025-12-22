import * as z from 'zod';
import { EDGE_SHAPES } from '@/lib/constants';

const EdgeShapeSchema = z.enum(EDGE_SHAPES);
const EdgeStyleOptionsSchema = z.object({
  isFloating: z.boolean(),
  isAnimated: z.boolean(),
  shape: EdgeShapeSchema,
});

export type EdgeShape = z.infer<typeof EdgeShapeSchema>;
export type EdgeStyleOptions = z.infer<typeof EdgeStyleOptionsSchema>;
