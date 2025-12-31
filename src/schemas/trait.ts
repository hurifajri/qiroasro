import * as z from 'zod';

export const RemoteTraitSchema = z.object({
  id: z.number().int(),
  group_id: z.number().int(),
  slug: z.string().min(1),
  is_middle_trait: z.boolean(),
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

export const RemoteTraitGroupSchema = z.object({
  id: z.number().int(),
  slug: z.string().min(1),
  is_lazimah: z.boolean(),
  has_middle_trait: z.boolean(),
  sort_order: z.number().int(),
});

const TraitGroupSchema = z
  .object({
    ...RemoteTraitGroupSchema.shape,
    isLazimah: z.boolean(),
    hasMiddleTrait: z.boolean(),
    sortOrder: z.number().int(),
  })
  .omit({ is_lazimah: true, has_middle_trait: true, sort_order: true });

export const RemoteTraitGroupsSchema = z.array(RemoteTraitGroupSchema);

export type RemoteTraitGroup = z.infer<typeof RemoteTraitGroupSchema>;
export type TraitGroup = z.infer<typeof TraitGroupSchema>;
