import {
  boolean,
  type InferOutput,
  integer,
  minLength,
  number,
  object,
  pipe,
  string,
} from 'valibot';

export const TraitSchema = object({
  id: pipe(number(), integer()),
  groupId: pipe(number(), integer()),
  slug: pipe(string(), minLength(1)),
  isMiddleTrait: boolean(),
  sortOrder: pipe(number(), integer()),
});

export type Trait = InferOutput<typeof TraitSchema>;

export const TraitGroupSchema = object({
  id: pipe(number(), integer()),
  slug: pipe(string(), minLength(1)),
  isLazimah: boolean(),
  hasMiddleTrait: boolean(),
  sortOrder: pipe(number(), integer()),
});

export type TraitGroup = InferOutput<typeof TraitGroupSchema>;
