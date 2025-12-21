import * as z from 'zod';

const RemoteTraitSchema = z.object({
  id: z.number().int(),
  group_id: z.number().int(),
  is_middle_trait: z.boolean(),
  slug: z.string().min(1),
  sort_order: z.number().int(),
});

const TraitSchema = z
  .object({
    ...RemoteTraitSchema.shape,
    groupId: z.number().int(),
    isMiddleTrait: z.boolean(),
    sortOrder: z.number().int(),
  })
  .omit({ group_id: true, is_middle_trait: true, sort_order: true });

export const RemoteTraitsSchema = z.array(RemoteTraitSchema);

export type RemoteTrait = z.infer<typeof RemoteTraitSchema>;
export type Trait = z.infer<typeof TraitSchema>;
