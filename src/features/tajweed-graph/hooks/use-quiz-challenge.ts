'use client';

import type { Edge, Node } from '@xyflow/react';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react';

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

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lastGeneratedKeyRef = useRef<string | null>(null);
  const generateQuizRef = useRef(generateQuiz);

  useEffect(() => {
    generateQuizRef.current = generateQuiz;
  }, [generateQuiz]);

  const clearPendingTimeouts = useCallback(() => {
    for (const timer of timeoutsRef.current) {
      clearTimeout(timer);
    }
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearPendingTimeouts();
  }, [clearPendingTimeouts]);

  function handleCheckAndNext() {
    processAnswer();
  }

  const {
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
    timeRemaining,
  } = useQuizTimer({
    duration: currentConfig.timerDuration,
    enabled: mode === 'challenge' && isStarted && !result,
    onTimeUp: handleCheckAndNext,
    isPaused: isChecked,
  });

  const startTimerRef = useRef(startTimer);
  const resetTimerRef = useRef(resetTimer);

  useEffect(() => {
    startTimerRef.current = startTimer;
    resetTimerRef.current = resetTimer;
  }, [startTimer, resetTimer]);

  function handlePlayAgain() {
    if (!difficulty) return;

    // trackEvent('challenge_retry', { locale, theme, difficulty });

    clearPendingTimeouts();
    lastGeneratedKeyRef.current = null;
    setNodes([]);
    setEdges([]);
    reset();
    setMode('challenge');
    selectDifficulty(difficulty);
  }

  function handleChangeMode() {
    clearPendingTimeouts();
    lastGeneratedKeyRef.current = null;
    stopTimer();
    setNodes([]);
    setEdges([]);
    reset();
  }

  // Shared function to process challenge answer (used by both timeout and manual check)
  function processAnswer() {
    clearPendingTimeouts();

    // Calculate time spent on this question from timer
    const timeSpent = currentConfig.timerDuration - (timeRemaining ?? 0);
    addChallengeTimeSpent(timeSpent);

    // Call checkAnswer to update edge colors (blue/red)
    // Pass current question number (1-indexed)
    const { score: currentScore, questionAnalytics } = checkAnswer(
      currQuestionIdx + 1,
    );

    // Add analytics for current question only (should only be 1 analytic in array)
    const currentAnalytic = questionAnalytics[0];
    if (currentAnalytic) {
      addAnalytic(currentAnalytic);
    }

    // Use incorrectCount from analytics as single source of truth
    const incorrectConnection = currentAnalytic?.incorrectCount ?? 0;
    const isPerfect =
      currentAnalytic?.isPerfect ?? currentScore.correct === currentScore.total;

    const stat = {
      correctConnection: currentScore.correct,
      incorrectConnection,
      isPerfect,
    };
    recordQuestionScore(stat);

    // Animate score changes with delay
    let delay = 0;
    for (let i = 0; i < currentScore.correct; i++) {
      timeoutsRef.current.push(
        setTimeout(() => addConnectionScore(true), delay),
      );
      delay += ANIMATION_DELAY;
    }
    for (let i = 0; i < incorrectConnection; i++) {
      timeoutsRef.current.push(
        setTimeout(() => addConnectionScore(false), delay),
      );
      delay += ANIMATION_DELAY;
    }

    const totalAnimations = currentScore.correct + incorrectConnection;
    const animationDuration = totalAnimations * ANIMATION_DELAY + 800;

    timeoutsRef.current.push(
      setTimeout(() => {
        if (currQuestionIdx >= TOTAL_CHALLENGE_QUESTION - 1) {
          finish();
        } else {
          nextQuestion();
        }
      }, animationDuration),
    );
  }

  // Generate challenge question when index changes
  useEffect(() => {
    if (mode !== 'challenge' || !isStarted || result) {
      lastGeneratedKeyRef.current = null;
      return;
    }

    if (!currentQuestion) return;

    const questionKey = `${difficulty ?? 'easy'}-${currQuestionIdx}`;
    if (lastGeneratedKeyRef.current === questionKey) return;
    lastGeneratedKeyRef.current = questionKey;

    setChallengeCurrQuestion(currentQuestion);
    generateQuizRef.current(currentQuestion.type, {
      lettersPerQuiz: currentQuestion.lettersPerQuiz,
      targetsPerQuiz: currentQuestion.targetsPerQuiz,
      multiEdge: currentQuestion.allowMultiEdge,
      specificLetterId: null,
    });
    setType(currentQuestion.type);
    resetTimerRef.current();

    if (currQuestionIdx === 0 && difficulty) {
      // trackEvent('challenge_started', { locale, theme, difficulty });
      startTimerRef.current();
    }
  }, [
    mode,
    isStarted,
    currQuestionIdx,
    currentQuestion,
    result,
    setType,
    setChallengeCurrQuestion,
    difficulty,
  ]);

  return {
    handleCheckAndNext,
    handlePlayAgain,
    handleChangeMode,
    stopTimer,
    timeRemaining,
  };
}
