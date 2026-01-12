'use client';

import type { Edge, Node } from '@xyflow/react';
import { useLocale } from 'next-intl';
import type { Dispatch, SetStateAction } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useGlobalStore } from '@/providers/global';
import { useQuizStore } from '../providers/quiz';
import type { UseQuizGeneratorReturn } from './use-quiz-generator';
import { useQuizTimer } from './use-quiz-timer';

interface UseQuizPracticeOptions {
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  generator: UseQuizGeneratorReturn;
}

export function useQuizPractice({
  setNodes,
  setEdges,
  generator,
}: UseQuizPracticeOptions) {
  const locale = useLocale();
  const theme = useGlobalStore((s) => s.theme);

  const { generateQuiz, checkAnswer } = generator;

  const type = useQuizStore((s) => s.type);
  const mode = useQuizStore((s) => s.mode);
  const isChecked = useQuizStore((s) => s.isChecked);
  const settings = useQuizStore((s) => s.practiceSettings);
  const start = useQuizStore((s) => s.startPractice);
  const reset = useQuizStore((s) => s.resetPractice);
  const setPracticeScore = useQuizStore((s) => s.setPracticeScore);

  function handleCheckAnswer() {
    if (!type) return;

    const { score } = checkAnswer();
    trackEvent('practice_quiz_checked', {
      locale,
      theme,
      type,
      correct: score.correct,
      total: score.total,
    });
    setPracticeScore(score);
  }

  const {
    start: startTimer,
    stop: stopTimer,
    timeRemaining,
  } = useQuizTimer({
    duration: settings.timerDuration,
    enabled: mode === 'practice' && settings.timerMode,
    onTimeUp: handleCheckAnswer,
    isPaused: isChecked,
  });

  function handleStart() {
    if (!type) return;

    trackEvent('practice_quiz_started', {
      locale,
      theme,
      type,
      letter_count: settings.lettersPerQuiz,
      target_count: settings.targetsPerQuiz,
      multi_answer: settings.multiEdge,
      timer_mode: settings.timerMode,
      timer_duration: settings.timerDuration,
    });

    setPracticeScore({ correct: 0, total: 0 });
    generateQuiz(type);
    startTimer();
    start();
  }

  function handlePlayAgain() {
    if (!type) return;

    trackEvent('practice_quiz_retry', { locale, theme, type });

    stopTimer();
    setNodes([]);
    setEdges([]);
    setPracticeScore({ correct: 0, total: 0 });
    generateQuiz(type);
    startTimer();
  }

  function handleChangeMode() {
    stopTimer();
    setNodes([]);
    setEdges([]);
    reset();
  }

  return {
    handleStart,
    handlePlayAgain,
    handleChangeMode,
    handleCheckAnswer,
    stopTimer,
    timeRemaining,
  };
}
