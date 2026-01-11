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
  const { generateQuiz, checkAnswer } = generator;

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
  const setChallengeCurrQuestion = useQuizStore(
    (s) => s.setChallengeCurrQuestion,
  );
  const addChallengeTimeSpent = useQuizStore((s) => s.addChallengeTimeSpent);

  const currentConfig = CHALLENGE_QUIZ_LEVEL[difficulty ?? 'easy'];
  const currentQuestion = currentConfig.questions[currQuestionIdx];

  // Shared function to process challenge answer (used by both timeout and manual check)
  function processAnswer(currentTimeRemaining: number | null) {
    // Calculate time spent on this question from timer
    const timeSpent = currentConfig.timerDuration - (currentTimeRemaining ?? 0);
    addChallengeTimeSpent(timeSpent);

    // Call checkAnswer to update edge colors (blue/red)
    const { score: currentScore, incorrectItem } = checkAnswer();
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
    // Note: currentScore.total is requiredConnection, so (total - correct) already includes
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

    const animationDuration = currentScore.total * ANIMATION_DELAY + 800;

    setTimeout(() => {
      if (currQuestionIdx >= TOTAL_CHALLENGE_QUESTION - 1) {
        const totalPossible =
          score.correctConnection +
          score.incorrectConnection +
          currentScore.total;
        finish(totalPossible);
      } else {
        nextQuestion();
      }
    }, animationDuration);
  }

  function handleTimeUp() {
    if (isChecked) return;

    // When timer runs out, timeRemaining is 0
    processAnswer(0);
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
      setChallengeCurrQuestion(currentQuestion);
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
    setChallengeCurrQuestion,
  ]);

  // Handlers
  function handleCheckAndNext() {
    processAnswer(timeRemaining);
  }

  function handlePlayAgain() {
    setNodes([]);
    setEdges([]);
    reset();
    setMode('challenge');
    if (difficulty) selectDifficulty(difficulty);
  }

  function handleChangeMode() {
    stopTimer();
    setNodes([]);
    setEdges([]);
    reset();
  }

  return {
    handleCheckAndNext,
    handlePlayAgain,
    handleChangeMode,
    stopTimer,
    timeRemaining,
  };
}
