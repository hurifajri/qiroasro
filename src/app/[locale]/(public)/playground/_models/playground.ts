import {
  transformRemoteArticulationAreas,
  transformRemoteArticulationPoints,
} from '../_models/articulation';
import {
  transformRemoteTraitGroups,
  transformRemoteTraits,
} from '../_models/trait';
import type {
  PlaygroundData,
  RemotePlaygroundData,
} from '../_schemas/playground';
import {
  transformRemoteLetterArticulations,
  transformRemoteLetters,
  transformRemoteLetterTraits,
} from './letter';

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
