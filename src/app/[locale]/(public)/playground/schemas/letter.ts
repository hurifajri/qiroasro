import {
  boolean,
  type InferOutput,
  integer,
  minLength,
  number,
  object,
  omit,
  picklist,
  pipe,
  string,
} from 'valibot';

export const LETTERS = [
  'ء',
  'ب',
  'ت',
  'ث',
  'ج',
  'ح',
  'خ',
  'د',
  'ذ',
  'ر',
  'ز',
  'س',
  'ش',
  'ص',
  'ض',
  'ط',
  'ظ',
  'ع',
  'غ',
  'ف',
  'ق',
  'ك',
  'ل',
  'م',
  'ن',
  'و',
  'ه',
  'لا',
  'ي',
  'ـَا',
  'ـُو',
  'ـِي',
] as const;

export const RemoteLetterSchema = object({
  id: pipe(number(), integer()),
  slug: pipe(string(), minLength(1)),
  symbol: picklist(LETTERS),
  is_madd: boolean(),
  sort_order: pipe(number(), integer()),
});

const LetterSchema = omit(
  object({
    ...RemoteLetterSchema.entries,
    isMadd: boolean(),
    sortOrder: pipe(number(), integer()),
  }),
  ['is_madd', 'sort_order'],
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
