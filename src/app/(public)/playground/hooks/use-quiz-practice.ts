'use client';

import type { Edge, Node } from '@xyflow/react';
import { useCallback } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useQuizStore } from '../providers/quiz';
import type { QuizMode } from '../schemas/quiz';
import type { UseQuizGeneratorReturn } from './use-quiz-generator';
import { useQuizTimer } from './use-quiz-timer';

interface UseQuizPracticeOptions {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  generator: UseQuizGeneratorReturn;
  isChallenge: boolean;
}

export function useQuizPractice({
  setNodes,
  setEdges,
  generator,
  isChallenge,
}: UseQuizPracticeOptions) {
  const { generateQuiz, checkAnswers } = generator;

  // Store selectors
  const mode = useQuizStore((s) => s.mode);
  const setMode = useQuizStore((s) => s.setMode);
  const practiceSettings = useQuizStore((s) => s.practiceSettings);
  const setPracticeSettings = useQuizStore((s) => s.setPracticeSettings);
  const isStarted = useQuizStore((s) => s.isStarted);
  const startPracticeQuiz = useQuizStore((s) => s.startPracticeQuiz);
  const isChecked = useQuizStore((s) => s.isChecked);
  const practiceScore = useQuizStore((s) => s.practiceScore);
  const resetPracticeQuiz = useQuizStore((s) => s.resetPracticeQuiz);

  // Practice timer
  const handleTimeUp = useCallback(() => {
    if (!isChecked) checkAnswers();
  }, [isChecked, checkAnswers]);

  const {
    timeRemaining,
    start: startTimer,
    stop: stopTimer,
  } = useQuizTimer({
    duration: practiceSettings.timerDuration,
    enabled: practiceSettings.timerMode && !isChallenge,
    onTimeUp: handleTimeUp,
    isPaused: isChecked,
  });

  // Handlers
  const handleModeSelect = useCallback(
    (selectedMode: QuizMode) => {
      trackEvent('quiz_mode_selected', { mode: selectedMode });
      setMode(selectedMode);
    },
    [setMode],
  );

  const handleStartQuiz = useCallback(() => {
    if (mode) {
      trackEvent('quiz_started', { mode, practiceSettings });
      generateQuiz(mode);
      startPracticeQuiz();
      startTimer();
    }
  }, [mode, practiceSettings, generateQuiz, startPracticeQuiz, startTimer]);

  const handleResetQuiz = useCallback(
    (stopChallengeTimer: () => void) => {
      setNodes([]);
      setEdges([]);
      resetPracticeQuiz();
      stopTimer();
      stopChallengeTimer();
      startTimer();
    },
    [setNodes, setEdges, resetPracticeQuiz, stopTimer, startTimer],
  );

  const handlePlayAgainPractice = useCallback(() => {
    if (mode) {
      setNodes([]);
      setEdges([]);
      stopTimer();
      generateQuiz(mode);
      startTimer();
    }
  }, [mode, setNodes, setEdges, stopTimer, generateQuiz, startTimer]);

  return {
    // Practice state
    mode,
    practiceSettings,
    setPracticeSettings,
    isStarted,
    isChecked,
    practiceScore,
    timeRemaining,

    // Practice handlers
    handleModeSelect,
    handleStartQuiz,
    handleResetQuiz,
    handlePlayAgainPractice,
    checkAnswers,
    generateQuiz,

    // Timer controls (for use in parent)
    stopTimer,
    setMode,
    resetPracticeQuiz,
  };
}
