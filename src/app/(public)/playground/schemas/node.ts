import type { HierarchyDirection, LayoutMode } from '@/schemas/graph';
import type { QuizMode, QuizStatus } from './graph';

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
  isConnectedToSelected?: boolean;
  isDimmed?: boolean;
};

export type TargetQuiz = {
  id: number;
  label: string;
  mode: QuizMode;
  status: QuizStatus;
};
