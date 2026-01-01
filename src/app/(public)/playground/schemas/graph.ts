import type { EDGE_SHAPES, QUIZ_MODES, QUIZ_STATUSES, VIEW_MODES } from '@/lib/constants';
import type { Letter } from '@/schemas/letter';

// Types derived from constants
export type EdgeShape = (typeof EDGE_SHAPES)[number];
export type ViewMode = (typeof VIEW_MODES)[number];
export type QuizMode = (typeof QUIZ_MODES)[number];
export type QuizStatus = (typeof QUIZ_STATUSES)[number];

// Native TypeScript types
export interface EdgeStyleOptions {
  isFloating: boolean;
  isAnimated: boolean;
  shape: EdgeShape;
}

export interface QuizQuestion {
  letter: Letter;
  correctTargetIds: number[];
  targetType: QuizMode;
}

export interface QuizScoreCount {
  correct: number;
  total: number;
}

export interface TargetItem {
  id: number;
  slug: string;
}
