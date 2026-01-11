'use client';

import { createStore } from 'zustand/vanilla';
import { CORRECT_POINT, INCORRECT_POINT } from '@/lib/constants';
import type {
  ChallengeQuizAnalytic,
  ChallengeQuizDifficulty,
  ChallengeQuizQuestion,
  ChallengeQuizQuestionScore,
  ChallengeQuizResult,
  ChallengeQuizScore,
  PracticeQuizScore,
  QuizMode,
  QuizQuestion,
  QuizTarget,
  QuizType,
} from '../schemas/quiz';
import {
  DEFAULT_CHALLENGE_QUIZ_SCORE,
  PRACTICE_QUIZ_DEFAULT_SETTINGS,
  type PracticeQuizSettings,
} from '../schemas/quiz';

interface QuizState {
  // Base state
  isDialogOpen: boolean;
  mode: QuizMode | null;
  type: QuizType | null;
  isStarted: boolean;
  isChecked: boolean;
  isInstructionShown: boolean;
  questions: QuizQuestion[];
  targets: QuizTarget[];

  // Practice state
  practiceSettings: PracticeQuizSettings;
  practiceScore: PracticeQuizScore;

  // Challenge state
  challengeDifficulty: ChallengeQuizDifficulty | null;
  challengeCurrQuestion: ChallengeQuizQuestion | null;
  challengeCurrQuestionIdx: number;
  challengeTotalTime: number;
  challengeQuestionScores: ChallengeQuizQuestionScore[];
  challengeScore: ChallengeQuizScore;
  challengeResult: ChallengeQuizResult | null;
  challengeAnalytics: ChallengeQuizAnalytic[];
  challengeLastPointChange: { value: number; timestamp: number } | null;
}

interface QuizAction {
  // Base actions
  openDialog: () => void;
  setMode: (mode: QuizMode | null) => void;
  setType: (type: QuizType | null) => void;
  setIsChecked: (isChecked: boolean) => void;
  setIsInstructionShown: (isShown: boolean) => void;
  setQuestions: (questions: QuizQuestion[]) => void;
  setTargets: (targets: QuizTarget[]) => void;
  resetAll: () => void;

  // Practice actions
  setPracticeSettings: (settings: PracticeQuizSettings) => void;
  startPractice: () => void;
  setPracticeScore: (score: PracticeQuizScore) => void;
  resetPractice: () => void;

  // Challenge actions
  selectChallengeDifficulty: (
    difficulty: ChallengeQuizDifficulty | null,
  ) => void;
  startChallenge: () => void;
  nextChallengeQuestion: () => void;
  addConnectionChallengeScore: (isCorrect: boolean) => void;
  recordChallengeQuestionScore: (stat: ChallengeQuizQuestionScore) => void;
  addChallengeAnalytic: (
    item: string,
    type: ChallengeQuizAnalytic['type'],
    errorType: ChallengeQuizAnalytic['errorType'],
  ) => void;
  finishChallenge: () => void;
  setChallengeCurrQuestion: (question: ChallengeQuizQuestion | null) => void;
  addChallengeTimeSpent: (timeSpent: number) => void;
  resetChallenge: () => void;
}

export type QuizStore = QuizState & QuizAction;

const initialChallengeState = {
  challengeDifficulty: null as ChallengeQuizDifficulty | null,
  challengeCurrQuestion: null as ChallengeQuizQuestion | null,
  challengeCurrQuestionIdx: 0,
  challengeTotalTime: 0,
  challengeQuestionScores: [] as ChallengeQuizQuestionScore[],
  challengeScore: DEFAULT_CHALLENGE_QUIZ_SCORE,
  challengeResult: null as ChallengeQuizResult | null,
  challengeAnalytics: [] as ChallengeQuizAnalytic[],
  challengeLastPointChange: null as { value: number; timestamp: number } | null,
};

const initialState: QuizState = {
  isDialogOpen: false,
  mode: null,
  type: null,
  practiceSettings: PRACTICE_QUIZ_DEFAULT_SETTINGS,
  isStarted: false,
  isChecked: false,
  isInstructionShown: true,
  questions: [],
  targets: [],
  practiceScore: { correct: 0, total: 0 },
  ...initialChallengeState,
};

export function createQuizStore() {
  return createStore<QuizStore>()((set, get) => ({
    ...initialState,

    // Base actions
    openDialog: () => {
      set({ isDialogOpen: true });
    },
    setMode: (mode) => set({ mode }),
    setType: (type) => set({ type }),
    setIsChecked: (isChecked) => set({ isChecked }),
    setIsInstructionShown: (isInstructionShown) => set({ isInstructionShown }),
    setQuestions: (questions) => set({ questions }),
    setTargets: (targets) => set({ targets }),
    resetAll: () => set(initialState),

    // Practice actions
    setPracticeSettings: (settings) => set({ practiceSettings: settings }),
    startPractice: () => set({ isStarted: true }),
    setPracticeScore: (score) => set({ practiceScore: score }),
    resetPractice: () =>
      set({
        mode: null,
        type: null,
        isStarted: false,
        isChecked: false,
        questions: [],
        targets: [],
        practiceScore: { correct: 0, total: 0 },
      }),

    // Challenge actions
    selectChallengeDifficulty: (difficulty) =>
      set({ challengeDifficulty: difficulty }),
    startChallenge: () =>
      set({
        isStarted: true,
        challengeCurrQuestionIdx: 0,
        challengeTotalTime: 0,
        challengeQuestionScores: [],
        challengeScore: DEFAULT_CHALLENGE_QUIZ_SCORE,
        challengeAnalytics: [],
        challengeResult: null,
      }),
    nextChallengeQuestion: () =>
      set((state) => ({
        challengeCurrQuestionIdx: state.challengeCurrQuestionIdx + 1,
        isChecked: false,
        questions: [],
        targets: [],
      })),
    addConnectionChallengeScore: (isCorrect) =>
      set((state) => {
        const pointChange = isCorrect ? CORRECT_POINT : INCORRECT_POINT;
        return {
          challengeScore: {
            correctConnection:
              state.challengeScore.correctConnection + (isCorrect ? 1 : 0),
            incorrectConnection:
              state.challengeScore.incorrectConnection + (isCorrect ? 0 : 1),
            totalPoint: state.challengeScore.totalPoint + pointChange,
          },
          challengeLastPointChange: {
            value: pointChange,
            timestamp: Date.now(),
          },
        };
      }),
    recordChallengeQuestionScore: (stat) =>
      set((state) => ({
        challengeQuestionScores: [...state.challengeQuestionScores, stat],
      })),
    addChallengeAnalytic: (item, type, errorType) =>
      set((state) => {
        const existing = state.challengeAnalytics.find(
          (e) =>
            e.item === item && e.type === type && e.errorType === errorType,
        );
        if (existing) {
          return {
            challengeAnalytics: state.challengeAnalytics.map((e) =>
              e.item === item && e.type === type && e.errorType === errorType
                ? { ...e, errorCount: e.errorCount + 1 }
                : e,
            ),
          };
        }
        return {
          challengeAnalytics: [
            ...state.challengeAnalytics,
            { item, type, errorType, errorCount: 1 },
          ],
        };
      }),
    finishChallenge: () => {
      const state = get();
      const perfectQuestion = state.challengeQuestionScores.filter(
        (s) => s.isPerfect,
      ).length;

      // Calculate total possible connections from score
      const totalPossibleConnection =
        state.challengeScore.correctConnection +
        state.challengeScore.incorrectConnection;

      // Sort weakness by error count descending
      const sortedAnalytics = [...state.challengeAnalytics].sort(
        (a, b) => b.errorCount - a.errorCount,
      );

      set({
        challengeResult: {
          difficulty: state.challengeDifficulty ?? 'easy',
          score: state.challengeScore,
          questionScores: state.challengeQuestionScores,
          analytics: sortedAnalytics,
          totalQuestion: state.challengeQuestionScores.length,
          perfectQuestion,
          totalPossibleConnection,
          totalTime: state.challengeTotalTime * 1000, // Convert to ms for consistency
        },
      });
    },
    setChallengeCurrQuestion: (question) =>
      set({ challengeCurrQuestion: question }),
    addChallengeTimeSpent: (timeSpent) =>
      set((state) => ({
        challengeTotalTime: state.challengeTotalTime + timeSpent,
      })),
    resetChallenge: () =>
      set({
        ...initialChallengeState,
        mode: null,
        type: null,
        isStarted: false,
        isChecked: false,
        questions: [],
        targets: [],
      }),
  }));
}
