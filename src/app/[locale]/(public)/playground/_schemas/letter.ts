import {
  boolean,
  type InferOutput,
  integer,
  minLength,
  nullable,
  number,
  object,
  omit,
  picklist,
  pipe,
  string,
} from 'valibot';

export const LETTER_TAFKHIM_TYPES = [
  'always_tafkhim',
  'conditional',
  'always_tarqiq',
] as const;

export type LetterTafkhimType = (typeof LETTER_TAFKHIM_TYPES)[number];

export const RemoteLetterSchema = object({
  id: pipe(number(), integer()),
  slug: pipe(string(), minLength(1)),
  parent_letter_slug: nullable(string()),
  symbol: pipe(string(), minLength(1)),
  tafkhim_type: picklist(LETTER_TAFKHIM_TYPES),
  sort_order: pipe(number(), integer()),
});

const LetterSchema = omit(
  object({
    ...RemoteLetterSchema.entries,
    parentLetterSlug: nullable(string()),
    tafkhimType: picklist(LETTER_TAFKHIM_TYPES),
    sortOrder: pipe(number(), integer()),
  }),
  ['parent_letter_slug', 'tafkhim_type', 'sort_order'],
);

export type RemoteLetter = InferOutput<typeof RemoteLetterSchema>;
export type Letter = InferOutput<typeof LetterSchema>;

export const RemoteLetterArticulationSchema = object({
  letter_id: pipe(number(), integer()),
  point_id: pipe(number(), integer()),
  is_primary: boolean(),
  sort_order: pipe(number(), integer()),
});

const LetterArticulationSchema = object({
  isPrimary: boolean(),
  letterId: pipe(number(), integer()),
  pointId: pipe(number(), integer()),
  sortOrder: pipe(number(), integer()),
});

export type RemoteLetterArticulation = InferOutput<
  typeof RemoteLetterArticulationSchema
>;
export type LetterArticulation = InferOutput<typeof LetterArticulationSchema>;

export const RemoteLetterTraitSchema = object({
  letter_id: pipe(number(), integer()),
  trait_id: pipe(number(), integer()),
});

const LetterTraitSchema = object({
  letterId: pipe(number(), integer()),
  traitId: pipe(number(), integer()),
});

export type RemoteLetterTrait = InferOutput<typeof RemoteLetterTraitSchema>;
export type LetterTrait = InferOutput<typeof LetterTraitSchema>;
