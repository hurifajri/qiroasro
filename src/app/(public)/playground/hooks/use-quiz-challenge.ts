'use client';

import type { Edge, Node } from '@xyflow/react';
import { type Dispatch, type SetStateAction, useEffect } from 'react';
import { useQuizStore } from '../providers/quiz';
import {
  CHALLENGE_QUIZ_LEVEL,
  CHALLENGE_QUIZ_QUESTIONS,
} from '../schemas/quiz';
import type { UseQuizGeneratorReturn } from './use-quiz-generator';
import { useQuizTimer } from './use-quiz-timer';

const TOTAL_CHALLENGE_QUESTION = CHALLENGE_QUIZ_QUESTIONS.length;
const ANIMATION_DELAY = 150;

interface UseQuizChallengeOptions {
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  generator: UseQuizGeneratorReturn;
}

export function useQuizChallenge({
  setNodes,
  setEdges,
  generator,
}: UseQuizChallengeOptions) {
  const { generateQuiz, checkAnswers } = generator;

  const mode = useQuizStore((s) => s.mode);
  const setMode = useQuizStore((s) => s.setMode);
  const isChecked = useQuizStore((s) => s.isChecked);
  const setType = useQuizStore((s) => s.setType);
  const isStarted = useQuizStore((s) => s.isStarted);
  const difficulty = useQuizStore((s) => s.challengeDifficulty);
  const selectDifficulty = useQuizStore((s) => s.selectChallengeDifficulty);
  const currQuestionIdx = useQuizStore((s) => s.challengeCurrQuestionIdx);
  const score = useQuizStore((s) => s.challengeScore);
  const result = useQuizStore((s) => s.challengeResult);
  const nextQuestion = useQuizStore((s) => s.nextChallengeQuestion);
  const addConnectionScore = useQuizStore((s) => s.addConnectionChallengeScore);
  const recordQuestionScore = useQuizStore(
    (s) => s.recordChallengeQuestionScore,
  );
  const addAnalytic = useQuizStore((s) => s.addChallengeAnalytic);
  const finish = useQuizStore((s) => s.finishChallenge);
  const reset = useQuizStore((s) => s.resetChallenge);

  const currentConfig = CHALLENGE_QUIZ_LEVEL[difficulty ?? 'easy'];
  const currentQuestion = currentConfig.questions[currQuestionIdx];

  // Shared function to process challenge answer (used by both timeout and manual check)
  function processAnswer() {
    // Call checkAnswers to update edge colors (blue/red)
    const { score: currentScore, incorrectItem } = checkAnswers();
    const isPerfect = currentScore.correct === currentScore.total;

    const stat = {
      correctConnection: currentScore.correct,
      incorrectConnection: currentScore.total - currentScore.correct,
      isPerfect,
    };
    recordQuestionScore(stat);

    for (const item of incorrectItem) {
      addAnalytic(item.name, item.type, item.errorType);
    }

    // Animate score changes with delay
    // Note: currentScore.total is requiredConnections, so (total - correct) already includes
    // both wrong connections AND missed connections (connections not made before timeout)
    let delay = 0;
    for (let i = 0; i < currentScore.correct; i++) {
      setTimeout(() => addConnectionScore(true), delay);
      delay += ANIMATION_DELAY;
    }
    for (let i = 0; i < currentScore.total - currentScore.correct; i++) {
      setTimeout(() => addConnectionScore(false), delay);
      delay += ANIMATION_DELAY;
    }

    const endTime = Date.now();
    const animationDuration = currentScore.total * ANIMATION_DELAY + 800;

    setTimeout(() => {
      if (currQuestionIdx >= TOTAL_CHALLENGE_QUESTION - 1) {
        const totalPossible =
          score.correctConnection +
          score.incorrectConnection +
          currentScore.total;
        finish(totalPossible, endTime);
      } else {
        nextQuestion();
      }
    }, animationDuration);
  }

  function handleTimeUp() {
    if (isChecked) return;

    processAnswer();
  }

  const {
    timeRemaining,
    start: startTimer,
    reset: resetTimer,
    stop: stopTimer,
  } = useQuizTimer({
    duration: currentConfig.timerDuration,
    enabled: mode === 'challenge' && isStarted && !result,
    onTimeUp: handleTimeUp,
    isPaused: isChecked,
  });

  // Generate challenge question when index changes
  useEffect(() => {
    if (mode === 'challenge' && isStarted && currentQuestion && !result) {
      generateQuiz(currentQuestion.type);
      setType(currentQuestion.type);
      resetTimer();

      if (currQuestionIdx === 0) startTimer();
    }
  }, [
    mode,
    isStarted,
    currQuestionIdx,
    currentQuestion,
    result,
    generateQuiz,
    setType,
    resetTimer,
    startTimer,
  ]);

  // Handlers
  function handleCheckAndNext() {
    processAnswer();
  }

  function handlePlayAgain() {
    setNodes([]);
    setEdges([]);
    reset();
    setMode('challenge');
    if (difficulty) selectDifficulty(difficulty);
  }

  return {
    handleCheckAndNext,
    handlePlayAgain,
    stopTimer,
    timeRemaining,
  };
}
