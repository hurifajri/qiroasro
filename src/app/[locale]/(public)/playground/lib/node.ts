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

// ============================================
// Helpers
// ============================================

// Helper to get node type from ID
export function getNodeType(nodeId: string): string {
  if (nodeId.startsWith('letter-')) return 'letter';
  if (nodeId.startsWith('area-')) return 'area';
  if (nodeId.startsWith('point-')) return 'point';
  if (nodeId.startsWith('trait-group-')) return 'traitGroup';
  if (nodeId.startsWith('trait-')) return 'trait';
  return 'unknown';
}

// Helper to get category: articulation (area, point) vs trait (trait-group, trait) vs letter
export function getCategory(nodeType: string): string {
  if (nodeType === 'area' || nodeType === 'point') return 'articulation';
  if (nodeType === 'traitGroup' || nodeType === 'trait') return 'trait';
  return 'letter';
}

/**
 * Get estimated node width based on type
 */
export function getNodeWidth(nodeType: string | undefined): number {
  switch (nodeType) {
    case 'letter':
      return 96; // size-24 = 96px
    case 'articulationArea':
      return 120;
    case 'articulationPoint':
      return 100;
    case 'traitGroup':
      return 120;
    case 'trait':
      return 100;
    default:
      return 80;
  }
}

/**
 * Get estimated node height based on type
 */
export function getNodeHeight(nodeType: string | undefined): number {
  switch (nodeType) {
    case 'letter':
      return 96; // size-24 = 96px
    case 'articulationArea':
      return 48;
    case 'articulationPoint':
      return 36;
    case 'traitGroup':
      return 56;
    case 'trait':
      return 40;
    default:
      return 40;
  }
}
