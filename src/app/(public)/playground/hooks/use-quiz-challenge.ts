'use client';

import type { Edge, Node } from '@xyflow/react';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useQuizStore } from '../providers/quiz';
import { CHALLENGE_QUIZ_LEVEL, CHALLENGE_QUIZ_QUESTIONS } from '../schemas/quiz';
import type { UseQuizGeneratorReturn } from './use-quiz-generator';
import { useQuizTimer } from './use-quiz-timer';

const TOTAL_CHALLENGE_QUESTION = CHALLENGE_QUIZ_QUESTIONS.length;
const ANIMATION_DELAY = 150;

interface UseQuizChallengeOptions {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  generator: UseQuizGeneratorReturn;
}

export function useQuizChallenge({ setNodes, setEdges, generator }: UseQuizChallengeOptions) {
  const { generateQuiz, checkAnswers } = generator;

  // Store selectors
  const setMode = useQuizStore((s) => s.setMode);
  const setPracticeSettings = useQuizStore((s) => s.setPracticeSettings);
  const isStarted = useQuizStore((s) => s.isStarted);
  const isChecked = useQuizStore((s) => s.isChecked);

  // Challenge state
  const isChallenge = useQuizStore((s) => s.isChallenge);
  const enterChallenge = useQuizStore((s) => s.enterChallenge);
  const challengeDifficulty = useQuizStore((s) => s.challengeDifficulty);
  const selectChallengeDifficulty = useQuizStore((s) => s.selectChallengeDifficulty);
  const challengeCurrQuestionIdx = useQuizStore((s) => s.challengeCurrQuestionIdx);
  const challengeQuestionScores = useQuizStore((s) => s.challengeQuestionScores);
  const challengeScore = useQuizStore((s) => s.challengeScore);
  const challengeResult = useQuizStore((s) => s.challengeResult);
  const challengeLastPointChange = useQuizStore((s) => s.challengeLastPointChange);
  const startChallenge = useQuizStore((s) => s.startChallenge);
  const nextChallengeQuestion = useQuizStore((s) => s.nextChallengeQuestion);
  const addConnectionChallengeScore = useQuizStore((s) => s.addConnectionChallengeScore);
  const recordChallengeQuestionScore = useQuizStore((s) => s.recordChallengeQuestionScore);
  const addChallengeAnalytic = useQuizStore((s) => s.addChallengeAnalytic);
  const finishChallenge = useQuizStore((s) => s.finishChallenge);
  const resetChallenge = useQuizStore((s) => s.resetChallenge);

  // Current challenge config
  // TODO: Refactor this
  const currentChallengeConfig = CHALLENGE_QUIZ_LEVEL[challengeDifficulty || 'easy'];
  const currentQuestion = currentChallengeConfig.questions[challengeCurrQuestionIdx];

  // Shared function to process challenge answer (used by both timeout and manual check)
  function processChallengeAnswer() {
    // Call checkAnswers to update edge colors (blue/red)
    const { score: currentScore, incorrectItem } = checkAnswers();
    const isPerfect = currentScore.correct === currentScore.total;

    const stat = {
      correctConnection: currentScore.correct,
      incorrectConnection: currentScore.total - currentScore.correct,
      isPerfect,
    };
    recordChallengeQuestionScore(stat);

    for (const item of incorrectItem) {
      addChallengeAnalytic(item.name, item.type, item.errorType);
    }

    // Animate score changes with delay
    // Note: currentScore.total is requiredConnections, so (total - correct) already includes
    // both wrong connections AND missed connections (connections not made before timeout)
    let delay = 0;
    for (let i = 0; i < currentScore.correct; i++) {
      setTimeout(() => addConnectionChallengeScore(true), delay);
      delay += ANIMATION_DELAY;
    }
    for (let i = 0; i < currentScore.total - currentScore.correct; i++) {
      setTimeout(() => addConnectionChallengeScore(false), delay);
      delay += ANIMATION_DELAY;
    }

    const endTime = Date.now();
    const animationDuration = currentScore.total * ANIMATION_DELAY + 800;

    setTimeout(() => {
      if (challengeCurrQuestionIdx >= TOTAL_CHALLENGE_QUESTION - 1) {
        const totalPossible =
          challengeScore.correctConnection +
          challengeScore.incorrectConnection +
          currentScore.total;
        finishChallenge(totalPossible, endTime);
        trackEvent('challenge_completed', {
          difficulty: challengeDifficulty,
          totalPoints:
            challengeScore.totalPoint +
            (isPerfect ? currentScore.correct * 2 : currentScore.correct),
          accuracy: Math.round(
            ((challengeScore.correctConnection + currentScore.correct) / totalPossible) * 100,
          ),
          perfectQuestions:
            challengeQuestionScores.filter((q) => q.isPerfect).length + (isPerfect ? 1 : 0),
          totalQuestions: TOTAL_CHALLENGE_QUESTION,
        });
      } else {
        nextChallengeQuestion();
      }
    }, animationDuration);
  }

  // Challenge timer - when time runs out
  function handleChallengeTimeUp() {
    processChallengeAnswer();
  }

  const {
    timeRemaining: challengeTimeRemaining,
    start: startChallengeTimer,
    reset: resetChallengeTimer,
    stop: stopChallengeTimer,
  } = useQuizTimer({
    duration: currentChallengeConfig?.timerDuration ?? 60,
    enabled: isChallenge && isStarted && !challengeResult,
    onTimeUp: handleChallengeTimeUp,
    isPaused: isChecked,
  });

  // Generate challenge question when index changes
  useEffect(() => {
    if (isChallenge && isStarted && currentQuestion && !challengeResult) {
      setPracticeSettings({
        lettersPerQuiz: currentQuestion.lettersPerQuiz,
        targetsPerQuiz: currentQuestion.targetsPerQuiz,
        multiEdge: currentQuestion.allowMultiEdge,
        timerMode: true,
        timerDuration: currentChallengeConfig?.timerDuration ?? 60,
      });

      generateQuiz(currentQuestion.mode);
      setMode(currentQuestion.mode);
      resetChallengeTimer();

      if (challengeCurrQuestionIdx === 0) {
        startChallengeTimer();
      }
    }
  }, [
    isChallenge,
    isStarted,
    challengeCurrQuestionIdx,
    currentQuestion,
    challengeResult,
    currentChallengeConfig,
    setPracticeSettings,
    generateQuiz,
    setMode,
    resetChallengeTimer,
    startChallengeTimer,
  ]);

  // Handlers
  function handleChallengeCheckAndNext() {
    processChallengeAnswer();
  }

  function handleChallengeSelect() {
    trackEvent('quiz_mode_selected', { mode: 'challenge' });
    enterChallenge();
  }

  function handleDifficultySelect(difficulty: keyof typeof CHALLENGE_QUIZ_LEVEL) {
    trackEvent('challenge_difficulty_selected', { difficulty });
    selectChallengeDifficulty(difficulty);
  }

  function handleStartChallenge() {
    trackEvent('challenge_started', { difficulty: challengeDifficulty });
    startChallenge();
  }

  function handleBackToDifficultySelect() {
    resetChallenge();
    enterChallenge();
  }

  function handlePlayAgainChallenge() {
    setNodes([]);
    setEdges([]);
    resetChallenge();
    enterChallenge();
    if (challengeDifficulty) {
      selectChallengeDifficulty(challengeDifficulty);
    }
  }

  return {
    // Challenge state
    isChallenge,
    challengeDifficulty,
    challengeCurrQuestionIdx,
    challengeQuestionScores,
    challengeScore,
    challengeResult,
    challengeLastPointChange,
    challengeTimeRemaining,
    currentChallengeConfig,

    // Challenge handlers
    handleChallengeSelect,
    handleDifficultySelect,
    handleStartChallenge,
    handleBackToDifficultySelect,
    handlePlayAgainChallenge,
    handleChallengeCheckAndNext,

    // Timer controls (for use in parent)
    stopChallengeTimer,
  };
}
