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

export interface QuizTarget {
  id: number;
  slug: string;
}

export interface RegularQuizScore {
  correct: number;
  total: number;
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
interface RegularQuizModeConstraints {
  lettersPerQuiz: { min: number; max: number };
  targetsPerQuiz: { min: number; max: number };
  allowMultiEdge: boolean;
}

export const REGULAR_QUIZ_MODE_CONFIG: Record<QuizMode, RegularQuizModeConstraints> = {
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

export const REGULAR_DEFAULT_QUIZ_SETTINGS: RegularQuizSettings = {
  lettersPerQuiz: 1,
  targetsPerQuiz: 2,
  multiEdge: false,
  timerMode: false,
  timerDuration: 15,
};

// Track weakness for analysis
export interface ChallengeQuizStat {
  item: string;
  type: 'letter' | 'articulation_point' | 'trait';
  errorType: 'incorrect' | 'missed';
  errorCount: number;
}

// Challenge types
export type ChallengeQuizDifficulty = 'easy' | 'medium' | 'hard';

export interface ChallengeQuizScore {
  correctConnection: number;
  incorrectConnection: number;
  totalPoint: number;
}

// Track per-question stats for detailed results
export interface ChallengeQuizQuestionScore {
  correctConnection: number;
  incorrectConnection: number;
  timeSpent: number;
  isPerfect: boolean;
}

export interface ChallengeQuizResult {
  difficulty: ChallengeQuizDifficulty;
  scoring: ChallengeQuizScore;
  challengeQuestionScores: ChallengeQuizQuestionScore[];
  weakness: ChallengeQuizStat[];
  totalQuestion: number;
  perfectQuestion: number;
  questionWithError: number;
  totalPossibleConnection: number;
  totalTime: number;
  completedAt: Date;
}

interface ChallengeQuizQuestion {
  mode: QuizMode;
  lettersPerQuiz: number;
  targetsPerQuiz: number;
  allowMultiEdge: boolean;
}

// Questions for Challenge mode (same for all difficulties, only timer differs)
export const CHALLENGE_QUIZ_QUESTIONS: ChallengeQuizQuestion[] = [
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

interface ChallengeQuizLevel {
  timerDuration: number;
  question: ChallengeQuizQuestion[];
}

export const CHALLENGE_QUIZ_LEVEL: Record<ChallengeQuizDifficulty, ChallengeQuizLevel> = {
  easy: { timerDuration: 60, question: CHALLENGE_QUIZ_QUESTIONS },
  medium: { timerDuration: 30, question: CHALLENGE_QUIZ_QUESTIONS },
  hard: { timerDuration: 10, question: CHALLENGE_QUIZ_QUESTIONS },
};

export const DEFAULT_CHALLENGE_QUIZ_SCORE: ChallengeQuizScore = {
  correctConnection: 0,
  incorrectConnection: 0,
  totalPoint: 0,
};
