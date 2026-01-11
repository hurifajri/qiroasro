'use client';

import type { Edge, Node } from '@xyflow/react';
import type { Dispatch, SetStateAction } from 'react';
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
  const { generateQuiz, checkAnswer } = generator;

  const type = useQuizStore((s) => s.type);
  const mode = useQuizStore((s) => s.mode);
  const isChecked = useQuizStore((s) => s.isChecked);
  const settings = useQuizStore((s) => s.practiceSettings);
  const start = useQuizStore((s) => s.startPractice);
  const reset = useQuizStore((s) => s.resetPractice);
  const setPracticeScore = useQuizStore((s) => s.setPracticeScore);

  function handleStart() {
    if (!type) return;

    setPracticeScore({ correct: 0, total: 0 });
    generateQuiz(type);
    startTimer();
    start();
  }

  function handlePlayAgain() {
    if (!type) return;

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

  function handleCheckAnswer() {
    if (isChecked) return;

    const { score } = checkAnswer();
    setPracticeScore(score);
  }

  const {
    timeRemaining,
    start: startTimer,
    stop: stopTimer,
  } = useQuizTimer({
    duration: settings.timerDuration,
    enabled: settings.timerMode && mode === 'practice',
    onTimeUp: handleCheckAnswer,
    isPaused: isChecked,
  });

  return {
    handleStart,
    handlePlayAgain,
    handleChangeMode,
    handleCheckAnswer,
    stopTimer,
    timeRemaining,
  };
}
