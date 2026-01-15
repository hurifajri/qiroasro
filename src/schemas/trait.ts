import {
  array,
  boolean,
  type InferOutput,
  integer,
  minLength,
  number,
  object,
  omit,
  pipe,
  string,
} from 'valibot';

export const RemoteTraitSchema = object({
  id: pipe(number(), integer()),
  group_id: pipe(number(), integer()),
  slug: pipe(string(), minLength(1)),
  is_middle_trait: boolean(),
  sort_order: pipe(number(), integer()),
});

const TraitSchema = omit(
  object({
    ...RemoteTraitSchema.entries,
    groupId: pipe(number(), integer()),
    isMiddleTrait: boolean(),
    sortOrder: pipe(number(), integer()),
  }),
  ['group_id', 'is_middle_trait', 'sort_order'],
);

export const RemoteTraitsSchema = array(RemoteTraitSchema);

export type RemoteTrait = InferOutput<typeof RemoteTraitSchema>;
export type Trait = InferOutput<typeof TraitSchema>;

export const RemoteTraitGroupSchema = object({
  id: pipe(number(), integer()),
  slug: pipe(string(), minLength(1)),
  is_lazimah: boolean(),
  has_middle_trait: boolean(),
  sort_order: pipe(number(), integer()),
});

const TraitGroupSchema = omit(
  object({
    ...RemoteTraitGroupSchema.entries,
    isLazimah: boolean(),
    hasMiddleTrait: boolean(),
    sortOrder: pipe(number(), integer()),
  }),
  ['is_lazimah', 'has_middle_trait', 'sort_order'],
);

export const RemoteTraitGroupsSchema = array(RemoteTraitGroupSchema);

export type RemoteTraitGroup = InferOutput<typeof RemoteTraitGroupSchema>;
export type TraitGroup = InferOutput<typeof TraitGroupSchema>;
