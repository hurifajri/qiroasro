'use client';

import { createStore } from 'zustand/vanilla';
import type {
  ChallengeDifficulty,
  ChallengeQuestionStat,
  ChallengeResult,
  ChallengeScoring,
  ChallengeWeakness,
  QuizMode,
  QuizQuestion,
  QuizScoreCount,
  TargetItem,
} from '../schemas/quiz';
import {
  DEFAULT_CHALLENGE_SCORING,
  DEFAULT_QUIZ_SETTINGS,
  type QuizSettingsValues,
} from '../schemas/quiz';

// Point values for scoring
const CORRECT_POINT = 10;
const INCORRECT_POINT = -5;

interface QuizState {
  // Dialog state
  isDialogOpen: boolean;
  // Mode selection
  mode: QuizMode | null;
  // Settings
  settings: QuizSettingsValues;
  // Quiz state
  isStarted: boolean;
  isChecked: boolean;
  isUnsupportedConfig: boolean;
  isInstructionShown: boolean;
  // Quiz data
  questions: QuizQuestion[];
  targets: TargetItem[];
  score: QuizScoreCount;
  // Challenge state
  isChallengeMode: boolean;
  challengeDifficulty: ChallengeDifficulty | null;
  currentQuestionIndex: number;
  challengeStartTime: number | null;
  questionStartTime: number | null;
  questionStat: ChallengeQuestionStat[];
  challengeScoring: ChallengeScoring;
  challengeResult: ChallengeResult | null;
  // For weakness tracking
  errorItem: ChallengeWeakness[];
  // For point animation
  lastPointChange: { value: number; timestamp: number } | null;
}

interface QuizActions {
  // Dialog actions
  openDialog: () => void;
  closeDialog: () => void;
  // Mode actions
  setMode: (mode: QuizMode | null) => void;
  // Settings actions
  setSettings: (settings: QuizSettingsValues) => void;
  updateSettings: (partial: Partial<QuizSettingsValues>) => void;
  // Quiz actions
  startQuiz: () => void;
  setIsChecked: (isChecked: boolean) => void;
  setIsUnsupportedConfig: (isUnsupported: boolean) => void;
  setIsInstructionShown: (isShown: boolean) => void;
  setQuestions: (questions: QuizQuestion[]) => void;
  setTargets: (targets: TargetItem[]) => void;
  setScore: (score: QuizScoreCount) => void;
  resetQuiz: () => void;
  resetAll: () => void;
  // Challenge actions
  enterChallengeMode: () => void;
  selectChallengeDifficulty: (difficulty: ChallengeDifficulty) => void;
  startChallenge: () => void;
  nextChallengeQuestion: () => void;
  addConnectionScore: (isCorrect: boolean) => void;
  recordQuestionStat: (stat: ChallengeQuestionStat) => void;
  addErrorItem: (item: string, type: ChallengeWeakness['type']) => void;
  finishChallenge: (totalPossibleConnection: number, endTime: number) => void;
  resetChallenge: () => void;
}

export type QuizStore = QuizState & QuizActions;

const initialChallengeState = {
  isChallengeMode: false,
  challengeDifficulty: null as ChallengeDifficulty | null,
  currentQuestionIndex: 0,
  challengeStartTime: null as number | null,
  questionStartTime: null as number | null,
  questionStat: [] as ChallengeQuestionStat[],
  challengeScoring: DEFAULT_CHALLENGE_SCORING,
  challengeResult: null as ChallengeResult | null,
  errorItem: [] as ChallengeWeakness[],
  lastPointChange: null as { value: number; timestamp: number } | null,
};

const initialState: QuizState = {
  isDialogOpen: false,
  mode: null,
  settings: DEFAULT_QUIZ_SETTINGS,
  isStarted: false,
  isChecked: false,
  isUnsupportedConfig: false,
  isInstructionShown: true,
  questions: [],
  targets: [],
  score: { correct: 0, total: 0 },
  ...initialChallengeState,
};

export function createQuizStore() {
  return createStore<QuizStore>()((set, get) => ({
    ...initialState,

    // Dialog actions
    openDialog: () => set({ isDialogOpen: true }),
    closeDialog: () => set({ isDialogOpen: false }),

    // Mode actions
    setMode: (mode) => set({ mode }),

    // Settings actions
    setSettings: (settings) => set({ settings }),
    updateSettings: (partial) =>
      set((state) => ({
        settings: { ...state.settings, ...partial },
      })),

    // Quiz actions
    startQuiz: () => set({ isStarted: true, isInstructionShown: true }),
    setIsChecked: (isChecked) => set({ isChecked }),
    setIsUnsupportedConfig: (isUnsupportedConfig) => set({ isUnsupportedConfig }),
    setIsInstructionShown: (isInstructionShown) => set({ isInstructionShown }),
    setQuestions: (questions) => set({ questions }),
    setTargets: (targets) => set({ targets }),
    setScore: (score) => set({ score }),

    resetQuiz: () =>
      set({
        isStarted: false,
        isChecked: false,
        isUnsupportedConfig: false,
        questions: [],
        targets: [],
        score: { correct: 0, total: 0 },
      }),

    resetAll: () => set(initialState),

    // Challenge actions
    enterChallengeMode: () => set({ isChallengeMode: true }),

    selectChallengeDifficulty: (difficulty) => set({ challengeDifficulty: difficulty }),

    startChallenge: () =>
      set({
        isStarted: true,
        isInstructionShown: true,
        currentQuestionIndex: 0,
        challengeStartTime: Date.now(),
        questionStartTime: Date.now(),
        questionStat: [],
        challengeScoring: DEFAULT_CHALLENGE_SCORING,
        errorItem: [],
        challengeResult: null,
      }),

    nextChallengeQuestion: () =>
      set((state) => ({
        currentQuestionIndex: state.currentQuestionIndex + 1,
        questionStartTime: Date.now(),
        isChecked: false,
        questions: [],
        targets: [],
      })),

    addConnectionScore: (isCorrect) =>
      set((state) => {
        const pointChange = isCorrect ? CORRECT_POINT : INCORRECT_POINT;
        return {
          challengeScoring: {
            correctConnection: state.challengeScoring.correctConnection + (isCorrect ? 1 : 0),
            incorrectConnection: state.challengeScoring.incorrectConnection + (isCorrect ? 0 : 1),
            totalPoint: state.challengeScoring.totalPoint + pointChange,
          },
          lastPointChange: { value: pointChange, timestamp: Date.now() },
        };
      }),

    recordQuestionStat: (stat) =>
      set((state) => ({
        questionStat: [...state.questionStat, stat],
      })),

    addErrorItem: (item, type) =>
      set((state) => {
        const existing = state.errorItem.find((e) => e.item === item && e.type === type);
        if (existing) {
          return {
            errorItem: state.errorItem.map((e) =>
              e.item === item && e.type === type ? { ...e, errorCount: e.errorCount + 1 } : e,
            ),
          };
        }
        return {
          errorItem: [...state.errorItem, { item, type, errorCount: 1 }],
        };
      }),

    finishChallenge: (totalPossibleConnection, endTime) => {
      const state = get();
      const totalTime = state.challengeStartTime ? endTime - state.challengeStartTime : 0;
      const perfectQuestion = state.questionStat.filter((s) => s.isPerfect).length;
      const questionWithError = state.questionStat.length - perfectQuestion;

      // Sort weakness by error count descending
      const sortedWeakness = [...state.errorItem].sort((a, b) => b.errorCount - a.errorCount);

      set({
        challengeResult: {
          difficulty: state.challengeDifficulty ?? 'easy',
          scoring: state.challengeScoring,
          questionStat: state.questionStat,
          weakness: sortedWeakness.slice(0, 5), // Top 5 weaknesses
          totalQuestion: state.questionStat.length,
          perfectQuestion,
          questionWithError,
          totalPossibleConnection,
          totalTime,
          completedAt: new Date(),
        },
      });
    },

    resetChallenge: () => set(initialChallengeState),
  }));
}
