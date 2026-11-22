import type { NodeTypes } from '@xyflow/react';

import {
  ArticulationAreaNode,
  ArticulationPointNode,
} from './node-articulation';
import { LetterNode } from './node-letter';
import { TraitGroupNode, TraitNode } from './node-trait';

export const TAJWEED_NODE_TYPES: NodeTypes = {
  letter: LetterNode,
  articulationArea: ArticulationAreaNode,
  articulationPoint: ArticulationPointNode,
  traitGroup: TraitGroupNode,
  trait: TraitNode,
};
