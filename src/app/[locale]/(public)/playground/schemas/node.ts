import type { HierarchyDirection, LayoutMode } from '../schemas/graph';
import type { Letter } from './letter';
import type { QuizStatus, QuizType } from './quiz';

export const NODE_TYPES = [
  'letter',
  'articulation_area',
  'articulation_point',
  'trait_group',
  'trait',
] as const;

/**
 * Base node data properties shared across all playground graph nodes.
 * Used for layout calculation and visual state management.
 */
export type BaseNodeData = {
  slug: string;
  isFloating?: boolean;
  layoutMode?: LayoutMode;
  hierarchyDirection?: HierarchyDirection;
  hasSourceEdge?: boolean;
  hasTargetEdge?: boolean;
  isHighlighted?: boolean;
  isDimmed?: boolean;
};

export type LetterQuizNodeData = Letter & { status: QuizStatus };

export type TargetQuizNodeData = {
  id: number;
  slug: string;
  type: QuizType;
  status: QuizStatus;
};
