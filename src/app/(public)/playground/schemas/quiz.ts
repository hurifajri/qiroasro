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

export interface RegularQuizScore {
  correct: number;
  total: number;
}

export interface QuizTarget {
  id: number;
  slug: string;
}

// Settings per quiz
export interface RegularQuizSettings {
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

export const DEFAULT_QUIZ_SETTINGS: RegularQuizSettings = {
  lettersPerQuiz: 1,
  targetsPerQuiz: 2,
  multiEdge: false,
  timerMode: false,
  timerDuration: 15,
};

// Challenge types
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

export interface ChallengeQuestionConfig {
  mode: QuizMode;
  lettersPerQuiz: number;
  targetsPerQuiz: number;
  allowMultiEdge: boolean;
}

export interface ChallengeModeConfig {
  timerDuration: number;
  question: ChallengeQuestionConfig[];
}

export interface ChallengeScoring {
  correctConnection: number;
  incorrectConnection: number;
  totalPoint: number;
}

// Track per-question stats for detailed results
export interface ChallengeQuestionStat {
  correctConnection: number;
  incorrectConnection: number;
  timeSpent: number;
  isPerfect: boolean;
}

// Track weakness for analysis
export interface ChallengeWeakness {
  item: string;
  type: 'letter' | 'articulation_point' | 'trait';
  errorType: 'incorrect' | 'missed';
  errorCount: number;
}

export interface ChallengeResult {
  difficulty: ChallengeDifficulty;
  scoring: ChallengeScoring;
  questionStat: ChallengeQuestionStat[];
  weakness: ChallengeWeakness[];
  totalQuestion: number;
  perfectQuestion: number;
  questionWithError: number;
  totalPossibleConnection: number;
  totalTime: number;
  completedAt: Date;
}

// Questions for Challenge mode (same for all difficulties, only timer differs)
export const CHALLENGE_QUESTION: ChallengeQuestionConfig[] = [
  { mode: 'articulation_point', lettersPerQuiz: 1, targetsPerQuiz: 2, allowMultiEdge: false },
  { mode: 'articulation_point', lettersPerQuiz: 1, targetsPerQuiz: 3, allowMultiEdge: false },
  { mode: 'articulation_point', lettersPerQuiz: 1, targetsPerQuiz: 4, allowMultiEdge: false },
  { mode: 'articulation_point', lettersPerQuiz: 1, targetsPerQuiz: 5, allowMultiEdge: false },
  { mode: 'articulation_point', lettersPerQuiz: 5, targetsPerQuiz: 1, allowMultiEdge: false },
  { mode: 'trait', lettersPerQuiz: 1, targetsPerQuiz: 3, allowMultiEdge: true },
  { mode: 'trait', lettersPerQuiz: 1, targetsPerQuiz: 4, allowMultiEdge: true },
  { mode: 'trait', lettersPerQuiz: 1, targetsPerQuiz: 5, allowMultiEdge: true },
  { mode: 'trait', lettersPerQuiz: 5, targetsPerQuiz: 1, allowMultiEdge: true },
  { mode: 'trait', lettersPerQuiz: 5, targetsPerQuiz: 1, allowMultiEdge: true },
];

export const CHALLENGE_MODE_CONFIG: Record<ChallengeDifficulty, ChallengeModeConfig> = {
  easy: { timerDuration: 60, question: CHALLENGE_QUESTION },
  medium: { timerDuration: 30, question: CHALLENGE_QUESTION },
  hard: { timerDuration: 10, question: CHALLENGE_QUESTION },
};

export const DEFAULT_CHALLENGE_SCORING: ChallengeScoring = {
  correctConnection: 0,
  incorrectConnection: 0,
  totalPoint: 0,
};
