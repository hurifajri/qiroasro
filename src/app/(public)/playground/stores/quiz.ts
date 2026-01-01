'use client';

import { createStore } from 'zustand/vanilla';
import type { QuizMode, QuizQuestion, QuizScoreCount, TargetItem } from '../schemas/graph';
import { DEFAULT_QUIZ_SETTINGS, type QuizSettingsValues } from '../schemas/quiz';

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
}

export type QuizStore = QuizState & QuizActions;

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
};

export function createQuizStore() {
  return createStore<QuizStore>()((set) => ({
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
  }));
}
