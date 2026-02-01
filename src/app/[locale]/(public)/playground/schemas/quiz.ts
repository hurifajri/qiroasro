import type { LucideIcon } from 'lucide-react';
import type { Letter } from './letter';
import type { NODE_TYPES } from './node';

// Quiz Constants
export const CORRECT_POINT = 10;
export const INCORRECT_POINT = -1;
export const QUIZ_MODES = ['practice', 'challenge'] as const;
export const QUIZ_STATUSES = ['none', 'correct', 'incorrect'] as const;
export const QUIZ_ERROR_TYPES = ['incorrect', 'missed'] as const;
export const CHALLENGE_QUIZ_DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

export type ChallengeQuizDifficulty =
  (typeof CHALLENGE_QUIZ_DIFFICULTIES)[number];
export type QuizLetter = Letter & { status: QuizStatus };
export type QuizStatus = (typeof QUIZ_STATUSES)[number];
export type QuizMode = (typeof QUIZ_MODES)[number];
export type QuizType = Extract<NodeType, 'articulation_point' | 'trait'>;
type QuizErrorType = (typeof QUIZ_ERROR_TYPES)[number];
type NodeType = (typeof NODE_TYPES)[number];

// Quiz question and answer types
export interface QuizQuestion {
  letter: Letter;
  correctTargetIds: number[];
  targetType: QuizType;
}

export interface QuizTarget {
  id: number;
  slug: string;
}

export interface PracticeQuizScore {
  correct: number;
  total: number;
}

// Settings per quiz
export interface PracticeQuizSettings {
  lettersPerQuiz: number;
  targetsPerQuiz: number;
  multiEdge: boolean;
  timerMode: boolean;
  timerDuration: number; // in seconds
  specificLetterId: number | null;
}

// Config constraints per type
interface PracticeQuizTypeConstraints {
  lettersPerQuiz: { min: number; max: number };
  targetsPerQuiz: { min: number; max: number };
  allowMultiEdge: boolean;
}

export const PRACTICE_QUIZ_TYPE_CONFIG: Record<
  QuizType,
  PracticeQuizTypeConstraints
> = {
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

export const PRACTICE_QUIZ_DEFAULT_SETTINGS: PracticeQuizSettings = {
  lettersPerQuiz: 1,
  targetsPerQuiz: 3,
  multiEdge: false,
  timerMode: false,
  timerDuration: 15,
  specificLetterId: null,
};

// Track weakness for detailed analysis
export interface ChallengeQuizAnalytic {
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
  isPerfect: boolean;
}

export interface ChallengeQuizResult {
  difficulty: ChallengeQuizDifficulty;
  score: ChallengeQuizScore;
  questionScores: ChallengeQuizQuestionScore[];
  analytics: ChallengeQuizAnalytic[];
  totalQuestion: number;
  perfectQuestion: number;
  totalPossibleConnection: number;
  totalTime: number;
}

export interface ChallengeQuizQuestion {
  type: QuizType;
  lettersPerQuiz: number;
  targetsPerQuiz: number;
  allowMultiEdge: boolean;
}

// Questions for Challenge type (same for all difficulties, only timer differs)
export const CHALLENGE_QUIZ_QUESTIONS: ChallengeQuizQuestion[] = [
  {
    type: 'articulation_point',
    lettersPerQuiz: 1,
    targetsPerQuiz: 2,
    allowMultiEdge: false,
  },
  {
    type: 'articulation_point',
    lettersPerQuiz: 1,
    targetsPerQuiz: 3,
    allowMultiEdge: false,
  },
  {
    type: 'articulation_point',
    lettersPerQuiz: 1,
    targetsPerQuiz: 4,
    allowMultiEdge: false,
  },
  {
    type: 'articulation_point',
    lettersPerQuiz: 1,
    targetsPerQuiz: 5,
    allowMultiEdge: false,
  },
  {
    type: 'articulation_point',
    lettersPerQuiz: 5,
    targetsPerQuiz: 1,
    allowMultiEdge: false,
  },
  { type: 'trait', lettersPerQuiz: 1, targetsPerQuiz: 3, allowMultiEdge: true },
  { type: 'trait', lettersPerQuiz: 1, targetsPerQuiz: 4, allowMultiEdge: true },
  { type: 'trait', lettersPerQuiz: 1, targetsPerQuiz: 5, allowMultiEdge: true },
  { type: 'trait', lettersPerQuiz: 5, targetsPerQuiz: 1, allowMultiEdge: true },
  { type: 'trait', lettersPerQuiz: 5, targetsPerQuiz: 1, allowMultiEdge: true },
];

interface ChallengeQuizLevel {
  timerDuration: number;
  questions: ChallengeQuizQuestion[];
}

export const CHALLENGE_QUIZ_LEVEL: Record<
  ChallengeQuizDifficulty,
  ChallengeQuizLevel
> = {
  easy: { timerDuration: 60, questions: CHALLENGE_QUIZ_QUESTIONS },
  medium: { timerDuration: 30, questions: CHALLENGE_QUIZ_QUESTIONS },
  hard: { timerDuration: 10, questions: CHALLENGE_QUIZ_QUESTIONS },
};

export const DEFAULT_CHALLENGE_QUIZ_SCORE: ChallengeQuizScore = {
  correctConnection: 0,
  incorrectConnection: 0,
  totalPoint: 0,
};

// Stats grid item config for challenge results
export interface ChallengeStatGridItem {
  icon: LucideIcon;
  value: string;
  labelKey: string;
  bgClass: string;
  iconClass: string;
  valueClass: string;
}

// Connection stat item config
export interface ChallengeConnectionStatItem {
  value: string;
  labelKey: string;
  valueClass: string;
}

// Badge configuration
export interface ChallengeBadgeConfig {
  emoji: string;
  key: string;
  color: string;
}
