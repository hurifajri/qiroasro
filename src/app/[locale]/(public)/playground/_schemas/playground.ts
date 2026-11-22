import { array, type InferOutput, object } from 'valibot';

import {
  ArticulationAreaSchema,
  ArticulationPointSchema,
} from './articulation';
import {
  LetterArticulationSchema,
  LetterSchema,
  LetterTraitSchema,
} from './letter';
import { TraitGroupSchema, TraitSchema } from './trait';

export const PlaygroundDataSchema = object({
  letters: array(LetterSchema),
  articulationAreas: array(ArticulationAreaSchema),
  articulationPoints: array(ArticulationPointSchema),
  traitGroups: array(TraitGroupSchema),
  traits: array(TraitSchema),
  letterArticulations: array(LetterArticulationSchema),
  letterTraits: array(LetterTraitSchema),
});

export type PlaygroundData = InferOutput<typeof PlaygroundDataSchema>;
