import type {
  CHALLENGE_QUIZ_DIFFICULTIES,
  NODE_TYPES,
  QUIZ_ERROR_TYPES,
  QUIZ_STATUSES,
} from '@/lib/constants';
import type { Letter } from '@/schemas/letter';

export type ChallengeQuizDifficulty = (typeof CHALLENGE_QUIZ_DIFFICULTIES)[number];
export type QuizStatus = (typeof QUIZ_STATUSES)[number];
export type QuizMode = Extract<NodeType, 'articulation_point' | 'trait'>;
type QuizTargetType = Extract<NodeType, 'articulation_point' | 'trait'>;
type QuizErrorType = (typeof QUIZ_ERROR_TYPES)[number];
type NodeType = (typeof NODE_TYPES)[number];

// Quiz question and answer types
export interface QuizQuestion {
  letter: Letter;
  correctTargetIds: number[];
  targetType: QuizTargetType;
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

export const REGULAR_QUIZ_DEFAULT_SETTINGS: RegularQuizSettings = {
  lettersPerQuiz: 1,
  targetsPerQuiz: 3,
  multiEdge: false,
  timerMode: false,
  timerDuration: 15,
};

// Track weakness for analysis
export interface ChallengeQuizStat {
  item: string;
  type: NodeType;
  errorType: QuizErrorType;
  errorCount: number;
}

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
  score: ChallengeQuizScore;
  questionScores: ChallengeQuizQuestionScore[];
  stats: ChallengeQuizStat[];
  totalQuestion: number;
  perfectQuestion: number;
  questionWithMistake: number;
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
  questions: ChallengeQuizQuestion[];
}

export const CHALLENGE_QUIZ_LEVEL: Record<ChallengeQuizDifficulty, ChallengeQuizLevel> = {
  easy: { timerDuration: 60, questions: CHALLENGE_QUIZ_QUESTIONS },
  medium: { timerDuration: 30, questions: CHALLENGE_QUIZ_QUESTIONS },
  hard: { timerDuration: 10, questions: CHALLENGE_QUIZ_QUESTIONS },
};

export const DEFAULT_CHALLENGE_QUIZ_SCORE: ChallengeQuizScore = {
  correctConnection: 0,
  incorrectConnection: 0,
  totalPoint: 0,
};
