import * as z from 'zod';

const RemoteArticulationAreaSchema = z.object({
  id: z.number().int(),
  slug: z.string().min(1),
  sort_order: z.number().int(),
});

const ArticulationAreaSchema = z
  .object({
    ...RemoteArticulationAreaSchema.shape,
    sortOrder: z.number().int(),
  })
  .omit({ sort_order: true });

export const RemoteArticulationAreasSchema = z.array(
  RemoteArticulationAreaSchema,
);

export type RemoteArticulationArea = z.infer<
  typeof RemoteArticulationAreaSchema
>;
export type ArticulationArea = z.infer<typeof ArticulationAreaSchema>;

const RemoteArticulationPointSchema = z.object({
  area_id: z.number().int(),
  id: z.number().int(),
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

export const RemoteArticulationPointsSchema = z.array(
  RemoteArticulationPointSchema,
);

export type RemoteArticulationPoint = z.infer<
  typeof RemoteArticulationPointSchema
>;
export type ArticulationPoint = z.infer<typeof ArticulationPointSchema>;
