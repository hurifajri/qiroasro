import * as z from 'zod';
import { LETTERS } from '@/lib/constants';

export const RemoteLetterSchema = z.object({
  id: z.number().int(),
  slug: z.string().min(1),
  symbol: z.enum(LETTERS),
  is_madd: z.boolean(),
  sort_order: z.number().int(),
});

const LetterSchema = z
  .object({
    ...RemoteLetterSchema.shape,
    isMadd: z.boolean(),
    sortOrder: z.number().int(),
  })
  .omit({ is_madd: true, sort_order: true });

export const RemoteLettersSchema = z.array(RemoteLetterSchema);

export type RemoteLetter = z.infer<typeof RemoteLetterSchema>;
export type Letter = z.infer<typeof LetterSchema>;

export const RemoteLetterArticulationSchema = z.object({
  letter_id: z.number().int(),
  point_id: z.number().int(),
  is_primary: z.boolean(),
  sort_order: z.number().int(),
});

const LetterArticulationSchema = z.object({
  isPrimary: z.boolean(),
  letterId: z.number().int(),
  pointId: z.number().int(),
  sortOrder: z.number().int(),
});

export const RemoteLetterArticulationsSchema = z.array(RemoteLetterArticulationSchema);

export type RemoteLetterArticulation = z.infer<typeof RemoteLetterArticulationSchema>;
export type LetterArticulation = z.infer<typeof LetterArticulationSchema>;

export const RemoteLetterTraitSchema = z.object({
  letter_id: z.number().int(),
  trait_id: z.number().int(),
});

const LetterTraitSchema = z.object({
  letterId: z.number().int(),
  traitId: z.number().int(),
});

export const RemoteLetterTraitsSchema = z.array(RemoteLetterTraitSchema);

export type RemoteLetterTrait = z.infer<typeof RemoteLetterTraitSchema>;
export type LetterTrait = z.infer<typeof LetterTraitSchema>;
