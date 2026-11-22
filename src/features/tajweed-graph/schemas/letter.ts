import {
  boolean,
  type InferOutput,
  integer,
  minLength,
  nullable,
  number,
  object,
  picklist,
  pipe,
  string,
} from 'valibot';

import { LETTER_TAFKHIM_TYPES } from '@/components/graph/tajweed-node';

export const LetterSchema = object({
  id: pipe(number(), integer()),
  slug: pipe(string(), minLength(1)),
  parentLetterSlug: nullable(string()),
  symbol: pipe(string(), minLength(1)),
  tafkhimType: picklist(LETTER_TAFKHIM_TYPES),
  sortOrder: pipe(number(), integer()),
});

export type Letter = InferOutput<typeof LetterSchema>;

export const LetterArticulationSchema = object({
  letterId: pipe(number(), integer()),
  pointId: pipe(number(), integer()),
  isPrimary: boolean(),
  sortOrder: pipe(number(), integer()),
});

export type LetterArticulation = InferOutput<typeof LetterArticulationSchema>;

export const LetterTraitSchema = object({
  letterId: pipe(number(), integer()),
  traitId: pipe(number(), integer()),
});

export type LetterTrait = InferOutput<typeof LetterTraitSchema>;
