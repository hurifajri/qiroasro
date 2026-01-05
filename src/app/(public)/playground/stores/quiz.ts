'use client';

import { createStore } from 'zustand/vanilla';
import { trackEvent } from '@/lib/analytics';
import { CORRECT_POINT, INCORRECT_POINT } from '@/lib/constants';
import type {
  ChallengeQuizDifficulty,
  ChallengeQuizQuestionScore,
  ChallengeQuizResult,
  ChallengeQuizScore,
  ChallengeQuizStat,
  QuizMode,
  QuizQuestion,
  QuizTarget,
  RegularQuizScore,
} from '../schemas/quiz';
import {
  DEFAULT_CHALLENGE_QUIZ_SCORE,
  REGULAR_DEFAULT_QUIZ_SETTINGS,
  type RegularQuizSettings,
} from '../schemas/quiz';

interface QuizState {
  // Base state
  isDialogOpen: boolean;
  mode: QuizMode | null;
  isStarted: boolean;
  isChecked: boolean;
  isInstructionShown: boolean;
  questions: QuizQuestion[];
  targets: QuizTarget[];

  // Regular state
  regularSettings: RegularQuizSettings;
  regularScore: RegularQuizScore;

  // Challenge state
  isChallenge: boolean;
  challengeDifficulty: ChallengeQuizDifficulty | null;
  challengeCurrQuestionIdx: number;
  challengeStartTime: number | null;
  challengeQuestionStartTime: number | null;
  challengeQuestionScores: ChallengeQuizQuestionScore[];
  challengeScore: ChallengeQuizScore;
  challengeResult: ChallengeQuizResult | null;
  challengeStats: ChallengeQuizStat[];
  challengeLastPointChange: { value: number; timestamp: number } | null;
}

interface QuizAction {
  // Base actions
  openDialog: () => void;
  closeDialog: () => void;
  setMode: (mode: QuizMode | null) => void;
  setIsChecked: (isChecked: boolean) => void;
  setIsInstructionShown: (isShown: boolean) => void;
  setQuestions: (questions: QuizQuestion[]) => void;
  setTargets: (targets: QuizTarget[]) => void;
  resetAll: () => void;

  // Regular actions
  setRegularSettings: (settings: RegularQuizSettings) => void;
  updateRegularSettings: (partial: Partial<RegularQuizSettings>) => void;
  startRegularQuiz: () => void;
  setRegularScore: (score: RegularQuizScore) => void;
  resetRegularQuiz: () => void;

  // Challenge actions
  enterChallenge: () => void;
  selectChallengeDifficulty: (difficulty: ChallengeQuizDifficulty) => void;
  startChallenge: () => void;
  nextChallengeQuestion: () => void;
  addConnectionChallengeScore: (isCorrect: boolean) => void;
  recordChallengeQuestionScore: (stat: ChallengeQuizQuestionScore) => void;
  addChallengeStat: (
    item: string,
    type: ChallengeQuizStat['type'],
    errorType: ChallengeQuizStat['errorType'],
  ) => void;
  finishChallenge: (totalPossibleConnection: number, endTime: number) => void;
  resetChallenge: () => void;
}

export type QuizStore = QuizState & QuizAction;

const initialChallengeState = {
  isChallenge: false,
  challengeDifficulty: null as ChallengeQuizDifficulty | null,
  challengeCurrQuestionIdx: 0,
  challengeStartTime: null as number | null,
  challengeQuestionStartTime: null as number | null,
  challengeQuestionScores: [] as ChallengeQuizQuestionScore[],
  challengeScore: DEFAULT_CHALLENGE_QUIZ_SCORE,
  challengeResult: null as ChallengeQuizResult | null,
  challengeStats: [] as ChallengeQuizStat[],
  challengeLastPointChange: null as { value: number; timestamp: number } | null,
};

const initialState: QuizState = {
  isDialogOpen: false,
  mode: null,
  regularSettings: REGULAR_DEFAULT_QUIZ_SETTINGS,
  isStarted: false,
  isChecked: false,
  isInstructionShown: true,
  questions: [],
  targets: [],
  regularScore: { correct: 0, total: 0 },
  ...initialChallengeState,
};

export function createQuizStore() {
  return createStore<QuizStore>()((set, get) => ({
    ...initialState,

    // Base actions
    openDialog: () => {
      trackEvent('quiz_dialog_opened');
      set({ isDialogOpen: true });
    },
    closeDialog: () => set({ isDialogOpen: false }),
    setMode: (mode) => set({ mode }),
    setIsChecked: (isChecked) => set({ isChecked }),
    setIsInstructionShown: (isInstructionShown) => set({ isInstructionShown }),
    setQuestions: (questions) => set({ questions }),
    setTargets: (targets) => set({ targets }),
    resetAll: () => set(initialState),

    // Regular actions
    setRegularSettings: (settings) => set({ regularSettings: settings }),
    updateRegularSettings: (partial) =>
      set((state) => ({
        regularSettings: { ...state.regularSettings, ...partial },
      })),
    startRegularQuiz: () => set({ isStarted: true }),
    setRegularScore: (score) => set({ regularScore: score }),
    resetRegularQuiz: () =>
      set({
        isStarted: false,
        isChecked: false,
        questions: [],
        targets: [],
        regularScore: { correct: 0, total: 0 },
      }),

    // Challenge actions
    enterChallenge: () => set({ isChallenge: true }),
    selectChallengeDifficulty: (difficulty) => set({ challengeDifficulty: difficulty }),
    startChallenge: () =>
      set({
        isStarted: true,
        challengeCurrQuestionIdx: 0,
        challengeStartTime: Date.now(),
        challengeQuestionStartTime: Date.now(),
        challengeQuestionScores: [],
        challengeScore: DEFAULT_CHALLENGE_QUIZ_SCORE,
        challengeStats: [],
        challengeResult: null,
      }),
    nextChallengeQuestion: () =>
      set((state) => ({
        challengeCurrQuestionIdx: state.challengeCurrQuestionIdx + 1,
        challengeQuestionStartTime: Date.now(),
        isChecked: false,
        questions: [],
        targets: [],
      })),
    addConnectionChallengeScore: (isCorrect) =>
      set((state) => {
        const pointChange = isCorrect ? CORRECT_POINT : INCORRECT_POINT;
        return {
          challengeScore: {
            correctConnection: state.challengeScore.correctConnection + (isCorrect ? 1 : 0),
            incorrectConnection: state.challengeScore.incorrectConnection + (isCorrect ? 0 : 1),
            totalPoint: state.challengeScore.totalPoint + pointChange,
          },
          challengeLastPointChange: { value: pointChange, timestamp: Date.now() },
        };
      }),
    recordChallengeQuestionScore: (stat) =>
      set((state) => ({
        challengeQuestionScores: [...state.challengeQuestionScores, stat],
      })),
    addChallengeStat: (item, type, errorType) =>
      set((state) => {
        const existing = state.challengeStats.find(
          (e) => e.item === item && e.type === type && e.errorType === errorType,
        );
        if (existing) {
          return {
            challengeStats: state.challengeStats.map((e) =>
              e.item === item && e.type === type && e.errorType === errorType
                ? { ...e, errorCount: e.errorCount + 1 }
                : e,
            ),
          };
        }
        return {
          challengeStats: [...state.challengeStats, { item, type, errorType, errorCount: 1 }],
        };
      }),
    finishChallenge: (totalPossibleConnection, endTime) => {
      const state = get();
      const totalTime = state.challengeStartTime ? endTime - state.challengeStartTime : 0;
      const perfectQuestion = state.challengeQuestionScores.filter((s) => s.isPerfect).length;
      const questionWithMistake = state.challengeQuestionScores.length - perfectQuestion;

      // Sort weakness by error count descending
      const sortedWeakness = [...state.challengeStats].sort((a, b) => b.errorCount - a.errorCount);

      set({
        challengeResult: {
          difficulty: state.challengeDifficulty ?? 'easy',
          score: state.challengeScore,
          questionScores: state.challengeQuestionScores,
          stats: sortedWeakness.slice(0, 5), // Top 5 weaknesses
          totalQuestion: state.challengeQuestionScores.length,
          perfectQuestion,
          questionWithMistake,
          totalPossibleConnection,
          totalTime,
          completedAt: new Date(),
        },
      });
    },
    resetChallenge: () => set(initialChallengeState),
  }));
}
