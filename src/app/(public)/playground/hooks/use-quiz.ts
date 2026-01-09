'use client';

import type { Edge, Node } from '@xyflow/react';
import { useEdgesState, useNodesState } from '@xyflow/react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useQuizStore } from '../providers/quiz';
import { CHALLENGE_QUIZ_LEVEL, CHALLENGE_QUIZ_QUESTIONS, type QuizMode } from '../schemas/quiz';
import { useQuizGenerator } from './use-quiz-generator';
import { useQuizTimer } from './use-quiz-timer';

const TOTAL_CHALLENGE_QUESTION = CHALLENGE_QUIZ_QUESTIONS.length;
const ANIMATION_DELAY = 150;

export function useQuiz() {
  const t = useTranslations('playground_page.quiz');

  // Store selectors
  const mode = useQuizStore((s) => s.mode);
  const setMode = useQuizStore((s) => s.setMode);
  const regularSettings = useQuizStore((s) => s.regularSettings);
  const setRegularSettings = useQuizStore((s) => s.setRegularSettings);
  const isDialogOpen = useQuizStore((s) => s.isDialogOpen);
  const openDialog = useQuizStore((s) => s.openDialog);
  const isStarted = useQuizStore((s) => s.isStarted);
  const startRegularQuiz = useQuizStore((s) => s.startRegularQuiz);
  const isChecked = useQuizStore((s) => s.isChecked);
  const isInstructionShown = useQuizStore((s) => s.isInstructionShown);
  const setIsInstructionShown = useQuizStore((s) => s.setIsInstructionShown);
  const regularScore = useQuizStore((s) => s.regularScore);
  const resetRegularQuiz = useQuizStore((s) => s.resetRegularQuiz);
  const resetAll = useQuizStore((s) => s.resetAll);

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

  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const {
    generateQuiz,
    isValidConnection,
    onConnect,
    checkAnswers,
    connectionCount,
    requiredConnections,
  } = useQuizGenerator({ nodes, edges, setNodes, setEdges });

  // Current challenge config
  const currentChallengeConfig = useMemo(() => {
    if (!isChallenge || !challengeDifficulty) return null;
    return CHALLENGE_QUIZ_LEVEL[challengeDifficulty];
  }, [isChallenge, challengeDifficulty]);

  const currentQuestion = useMemo(() => {
    if (!currentChallengeConfig) return null;
    return currentChallengeConfig.questions[challengeCurrQuestionIdx];
  }, [currentChallengeConfig, challengeCurrQuestionIdx]);

  // Regular timer
  const handleTimeUp = useCallback(() => {
    if (!isChecked) checkAnswers();
  }, [isChecked, checkAnswers]);

  const {
    timeRemaining,
    start: startTimer,
    reset: _resetTimer,
    stop: stopTimer,
  } = useQuizTimer({
    duration: regularSettings.timerDuration,
    enabled: regularSettings.timerMode && !isChallenge,
    onTimeUp: handleTimeUp,
    isPaused: isChecked,
  });

  // Shared function to process challenge answer (used by both timeout and manual check)
  const processChallengeAnswer = useCallback(() => {
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
  }, [
    checkAnswers,
    recordChallengeQuestionScore,
    addChallengeAnalytic,
    addConnectionChallengeScore,
    challengeCurrQuestionIdx,
    finishChallenge,
    challengeScore,
    nextChallengeQuestion,
    challengeDifficulty,
    challengeQuestionScores.filter,
  ]);

  // Challenge timer - when time runs out
  const handleChallengeTimeUp = useCallback(() => {
    processChallengeAnswer();
  }, [processChallengeAnswer]);

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
    trackElapsedTime: true,
  });

  // Generate challenge question when index changes
  useEffect(() => {
    if (isChallenge && isStarted && currentQuestion && !challengeResult) {
      setRegularSettings({
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
    setRegularSettings,
    generateQuiz,
    setMode,
    resetChallengeTimer,
    startChallengeTimer,
  ]);

  // Handlers
  // Handler for manual check button click
  const handleChallengeCheckAndNext = useCallback(() => {
    processChallengeAnswer();
  }, [processChallengeAnswer]);

  const handleModeSelect = useCallback(
    (selectedMode: QuizMode) => {
      trackEvent('quiz_mode_selected', { mode: selectedMode });
      setMode(selectedMode);
    },
    [setMode],
  );

  const handleChallengeSelect = useCallback(() => {
    trackEvent('quiz_mode_selected', { mode: 'challenge' });
    enterChallenge();
  }, [enterChallenge]);

  const handleDifficultySelect = useCallback(
    (difficulty: keyof typeof CHALLENGE_QUIZ_LEVEL) => {
      trackEvent('challenge_difficulty_selected', { difficulty });
      selectChallengeDifficulty(difficulty);
    },
    [selectChallengeDifficulty],
  );

  const handleStartChallenge = useCallback(() => {
    trackEvent('challenge_started', { difficulty: challengeDifficulty });
    startChallenge();
  }, [startChallenge, challengeDifficulty]);

  const handleStartQuiz = useCallback(() => {
    if (mode) {
      trackEvent('quiz_started', { mode, regularSettings });
      generateQuiz(mode);
      startRegularQuiz();
      startTimer();
    }
  }, [mode, regularSettings, generateQuiz, startRegularQuiz, startTimer]);

  const handleBackToModeSelect = useCallback(() => {
    setMode(null);
    resetChallenge();
  }, [setMode, resetChallenge]);

  const handleBackToDifficultySelect = useCallback(() => {
    resetChallenge();
    enterChallenge();
  }, [resetChallenge, enterChallenge]);

  const handleResetQuiz = useCallback(() => {
    setNodes([]);
    setEdges([]);
    resetRegularQuiz();
    stopTimer();
    stopChallengeTimer();
    startTimer();
  }, [setNodes, setEdges, resetRegularQuiz, stopTimer, stopChallengeTimer, startTimer]);

  const handleDialogClose = useCallback(
    (open: boolean) => {
      if (!open) {
        resetAll();
        stopTimer();
        stopChallengeTimer();
      }
    },
    [resetAll, stopTimer, stopChallengeTimer],
  );

  const handlePlayAgain = useCallback(() => {
    setNodes([]);
    setEdges([]);
    resetChallenge();
    enterChallenge();
    if (challengeDifficulty) {
      selectChallengeDifficulty(challengeDifficulty);
    }
  }, [
    setNodes,
    setEdges,
    resetChallenge,
    enterChallenge,
    challengeDifficulty,
    selectChallengeDifficulty,
  ]);

  const handleBackToMenu = useCallback(() => {
    setNodes([]);
    setEdges([]);
    resetAll();
  }, [setNodes, setEdges, resetAll]);

  // Handler for "Try Again" button in regular mode
  const handleTryAgain = useCallback(() => {
    if (mode) {
      setNodes([]);
      setEdges([]);
      stopTimer();
      generateQuiz(mode);
      startTimer();
    }
  }, [mode, setNodes, setEdges, stopTimer, generateQuiz, startTimer]);

  // Screen state
  const screenState = useMemo(
    () => ({
      showModeSelection: !mode && !isChallenge,
      showDifficultySelection: isChallenge && !challengeDifficulty,
      showChallengeReady: isChallenge && !!challengeDifficulty && !isStarted,
      showChallengeResults: isChallenge && !!challengeResult,
      showChallengeQuiz: isChallenge && isStarted && !challengeResult,
      showRegularSettings: !isChallenge && !!mode && !isStarted,
      showRegularQuiz: !isChallenge && !!mode && isStarted,
    }),
    [mode, isChallenge, challengeDifficulty, isStarted, challengeResult],
  );

  const { dialogTitle, dialogDescription } = useMemo(() => {
    let title = t('select_mode');
    let description = t('select_mode_description');

    if (isChallenge) {
      if (challengeResult) {
        title = t('challenge_result');
        description = '';
      } else if (!challengeDifficulty) {
        title = t('challenge_select_difficulty');
      } else if (!isStarted) {
        title = t('mode_challenge');
        description = '';
      } else {
        title = t('mode_challenge');
        description = mode ? t('regular_description', { mode: 'makhraj/sifat' }) : '';
      }
    } else if (mode) {
      if (!isStarted) {
        title = t('regular_settings');
        description = t('regular_settings_description', {
          mode: mode === 'articulation_point' ? 'makharijul huruf' : 'sifatul huruf',
        });
      } else {
        title = t('regular_title', {
          mode: mode === 'articulation_point' ? 'Makharijul Huruf' : 'Sifatul Huruf',
        });
        description = t('regular_description', {
          mode: mode === 'articulation_point' ? 'makhraj' : 'sifat',
        });
      }
    }

    return { dialogTitle: title, dialogDescription: description };
  }, [isChallenge, challengeResult, challengeDifficulty, isStarted, mode, t]);

  return {
    // State
    mode,
    regularSettings,
    setRegularSettings,
    isDialogOpen,
    openDialog,
    isStarted,
    isChecked,
    isInstructionShown,
    setIsInstructionShown,
    regularScore,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    isValidConnection,
    timeRemaining,
    connectionCount,
    requiredConnections,

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

    // Handlers
    handleModeSelect,
    handleChallengeSelect,
    handleDifficultySelect,
    handleStartChallenge,
    handleStartQuiz,
    handleBackToModeSelect,
    handleBackToDifficultySelect,
    handleResetQuiz,
    handleDialogClose,
    handlePlayAgain,
    handleBackToMenu,
    handleChallengeCheckAndNext,
    handleTryAgain,
    checkAnswers,
    generateQuiz,

    // Screen state
    screenState,
    dialogTitle,
    dialogDescription,
  };
}
