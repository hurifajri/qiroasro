import * as z from 'zod';
import {
  type ArticulationArea,
  type ArticulationPoint,
  RemoteArticulationAreaSchema,
  RemoteArticulationPointSchema,
} from '@/schemas/articulation';
import {
  type Letter,
  type LetterArticulation,
  type LetterTrait,
  RemoteLetterArticulationSchema,
  RemoteLetterSchema,
  RemoteLetterTraitSchema,
} from '@/schemas/letter';
import {
  RemoteTraitGroupSchema,
  RemoteTraitSchema,
  type Trait,
  type TraitGroup,
} from '@/schemas/trait';

// Reuse existing remote schemas for the MV response
export const RemotePlaygroundDataSchema = z.object({
  letters: z.array(RemoteLetterSchema),
  articulation_areas: z.array(RemoteArticulationAreaSchema),
  articulation_points: z.array(RemoteArticulationPointSchema),
  trait_groups: z.array(RemoteTraitGroupSchema),
  traits: z.array(RemoteTraitSchema),
  letter_articulations: z.array(RemoteLetterArticulationSchema),
  letter_traits: z.array(RemoteLetterTraitSchema),
});

export type RemotePlaygroundData = z.infer<typeof RemotePlaygroundDataSchema>;

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
