import type { QUIZ_MODES, QUIZ_STATUSES } from '@/lib/constants';
import type { Letter } from '@/schemas/letter';

export type QuizMode = (typeof QUIZ_MODES)[number];
export type QuizStatus = (typeof QUIZ_STATUSES)[number];

// Quiz question and answer types
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

// Settings per quiz
export interface QuizSettingsValues {
  lettersPerQuiz: number;
  targetsPerQuiz: number;
  multiEdge: boolean;
  timerMode: boolean;
  timerDuration: number; // in seconds
}

// Config constraints per mode
export interface QuizModeConstraints {
  lettersPerQuiz: { min: number; max: number };
  targetsPerQuiz: { min: number; max: number };
  allowMultiEdge: boolean;
}

export const QUIZ_MODE_CONFIG: Record<QuizMode, QuizModeConstraints> = {
  articulation_point: {
    lettersPerQuiz: { min: 1, max: 5 },
    targetsPerQuiz: { min: 1, max: 5 },
    allowMultiEdge: false,
  },
  trait: {
    lettersPerQuiz: { min: 1, max: 5 },
    targetsPerQuiz: { min: 1, max: 5 },
    allowMultiEdge: true,
  },
};

export const DEFAULT_QUIZ_SETTINGS: QuizSettingsValues = {
  lettersPerQuiz: 1,
  targetsPerQuiz: 2,
  multiEdge: false,
  timerMode: false,
  timerDuration: 15,
};
