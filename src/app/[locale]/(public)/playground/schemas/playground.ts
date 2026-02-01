import { array, type InferOutput, object } from 'valibot';
import {
  type ArticulationArea,
  type ArticulationPoint,
  RemoteArticulationAreaSchema,
  RemoteArticulationPointSchema,
} from './articulation';
import {
  type Letter,
  type LetterArticulation,
  type LetterTrait,
  RemoteLetterArticulationSchema,
  RemoteLetterSchema,
  RemoteLetterTraitSchema,
} from './letter';
import {
  RemoteTraitGroupSchema,
  RemoteTraitSchema,
  type Trait,
  type TraitGroup,
} from './trait';

// Reuse existing remote schemas for the MV response
export const RemotePlaygroundDataSchema = object({
  letters: array(RemoteLetterSchema),
  articulation_areas: array(RemoteArticulationAreaSchema),
  articulation_points: array(RemoteArticulationPointSchema),
  trait_groups: array(RemoteTraitGroupSchema),
  traits: array(RemoteTraitSchema),
  letter_articulations: array(RemoteLetterArticulationSchema),
  letter_traits: array(RemoteLetterTraitSchema),
});

export type RemotePlaygroundData = InferOutput<
  typeof RemotePlaygroundDataSchema
>;

// Reuse existing transformed types
export interface PlaygroundData {
  letters: Letter[];
  articulationAreas: ArticulationArea[];
  articulationPoints: ArticulationPoint[];
  traitGroups: TraitGroup[];
  traits: Trait[];
  letterArticulations: LetterArticulation[];
  letterTraits: LetterTrait[];
}
