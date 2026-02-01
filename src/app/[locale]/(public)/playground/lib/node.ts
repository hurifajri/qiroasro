import type { Node } from '@xyflow/react';
import type {
  ArticulationArea,
  ArticulationPoint,
} from '../schemas/articulation';
import type { Letter } from '../schemas/letter';
import type { TargetQuizNodeData } from '../schemas/node';
import type { QuizLetter } from '../schemas/quiz';
import type { Trait, TraitGroup } from '../schemas/trait';

export function createLetterNode(
  letter: Letter,
  position: { x: number; y: number } = { x: 0, y: 0 },
): Node {
  return {
    id: `letter-${letter.id}`,
    type: 'letter',
    position,
    data: letter,
  };
}

export function createArticulationAreaNode(
  area: ArticulationArea,
  position: { x: number; y: number } = { x: 0, y: 0 },
): Node {
  return {
    id: `area-${area.id}`,
    type: 'articulationArea',
    position,
    data: area,
  };
}

export function createArticulationPointNode(
  point: ArticulationPoint,
  position: { x: number; y: number } = { x: 0, y: 0 },
): Node {
  return {
    id: `point-${point.id}`,
    type: 'articulationPoint',
    position,
    data: point,
  };
}

export function createTraitGroupNode(
  group: TraitGroup,
  position: { x: number; y: number } = { x: 0, y: 0 },
): Node {
  return {
    id: `trait-group-${group.id}`,
    type: 'traitGroup',
    position,
    data: group,
  };
}

export function createTraitNode(
  trait: Trait,
  position: { x: number; y: number } = { x: 0, y: 0 },
): Node {
  return {
    id: `trait-${trait.id}`,
    type: 'trait',
    position,
    data: trait,
  };
}

export function createLetterQuizNode(
  letter: QuizLetter,
  position: { x: number; y: number } = { x: 0, y: 0 },
): Node {
  return {
    id: `letter-quiz-${letter.id}`,
    type: 'letterQuiz',
    position,
    data: letter,
    draggable: false,
  };
}

export function createTargetQuizNode(
  target: TargetQuizNodeData,
  position: { x: number; y: number } = { x: 0, y: 0 },
): Node {
  return {
    id: `target-quiz-${target.id}`,
    type: 'targetQuiz',
    position,
    data: target,
    draggable: false,
  };
}
