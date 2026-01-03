import * as z from 'zod';

export const RemoteArticulationAreaSchema = z.object({
  id: z.number().int(),
  slug: z.string().min(1),
  is_muhaqqaq: z.boolean(),
  sort_order: z.number().int(),
});

const ArticulationAreaSchema = z
  .object({
    ...RemoteArticulationAreaSchema.shape,
    isMuhaqqaq: z.boolean(),
    sortOrder: z.number().int(),
  })
  .omit({ is_muhaqqaq: true, sort_order: true });

export const RemoteArticulationAreasSchema = z.array(RemoteArticulationAreaSchema);

export type RemoteArticulationArea = z.infer<typeof RemoteArticulationAreaSchema>;
export type ArticulationArea = z.infer<typeof ArticulationAreaSchema>;

export const RemoteArticulationPointSchema = z.object({
  id: z.number().int(),
  area_id: z.number().int(),
  slug: z.string().min(1),
  sort_order: z.number().int(),
});

const ArticulationPointSchema = z
  .object({
    ...RemoteArticulationPointSchema.shape,
    areaId: z.number().int(),
    sortOrder: z.number().int(),
  })
  .omit({ area_id: true, sort_order: true });

export const RemoteArticulationPointsSchema = z.array(RemoteArticulationPointSchema);

export type RemoteArticulationPoint = z.infer<typeof RemoteArticulationPointSchema>;
export type ArticulationPoint = z.infer<typeof ArticulationPointSchema>;
