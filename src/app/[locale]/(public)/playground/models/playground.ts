import {
  transformRemoteArticulationAreas,
  transformRemoteArticulationPoints,
} from '@/models/articulation';
import {
  transformRemoteLetterArticulations,
  transformRemoteLetters,
  transformRemoteLetterTraits,
} from '@/models/letter';
import {
  transformRemoteTraitGroups,
  transformRemoteTraits,
} from '@/models/trait';
import type {
  PlaygroundData,
  RemotePlaygroundData,
} from '../schemas/playground';

export function transformRemotePlaygroundData(
  remote: RemotePlaygroundData,
): PlaygroundData {
  return {
    letters: transformRemoteLetters(remote.letters),
    articulationAreas: transformRemoteArticulationAreas(
      remote.articulation_areas,
    ),
    articulationPoints: transformRemoteArticulationPoints(
      remote.articulation_points,
    ),
    traitGroups: transformRemoteTraitGroups(remote.trait_groups),
    traits: transformRemoteTraits(remote.traits),
    letterArticulations: transformRemoteLetterArticulations(
      remote.letter_articulations,
    ),
    letterTraits: transformRemoteLetterTraits(remote.letter_traits),
  };
}
