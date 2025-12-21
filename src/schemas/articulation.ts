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
