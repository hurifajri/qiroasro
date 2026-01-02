'use client';

import type { Edge, Node } from '@xyflow/react';
import { useEdgesState, useNodesState } from '@xyflow/react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo } from 'react';
import { useQuizStore } from '../providers/quiz';
import { CHALLENGE_MODE_CONFIG, type QuizMode } from '../schemas/quiz';
import { useChallengeTimer } from './use-challenge-timer';
import { useQuizGenerator } from './use-quiz-generator';
import { useQuizTimer } from './use-quiz-timer';

const TOTAL_CHALLENGE_QUESTION = 10;
const ANIMATION_DELAY = 150;

export function useQuiz() {
  const t = useTranslations('playground_page.quiz');

  // Store selectors
  const mode = useQuizStore((s) => s.mode);
  const setMode = useQuizStore((s) => s.setMode);
  const settings = useQuizStore((s) => s.settings);
  const setSettings = useQuizStore((s) => s.setSettings);
  const isDialogOpen = useQuizStore((s) => s.isDialogOpen);
  const openDialog = useQuizStore((s) => s.openDialog);
  const isStarted = useQuizStore((s) => s.isStarted);
  const startQuiz = useQuizStore((s) => s.startQuiz);
  const isChecked = useQuizStore((s) => s.isChecked);
  const isInstructionShown = useQuizStore((s) => s.isInstructionShown);
  const setIsInstructionShown = useQuizStore((s) => s.setIsInstructionShown);
  const score = useQuizStore((s) => s.score);
  const resetQuiz = useQuizStore((s) => s.resetQuiz);
  const resetAll = useQuizStore((s) => s.resetAll);

  // Challenge state
  const isChallengeMode = useQuizStore((s) => s.isChallengeMode);
  const enterChallengeMode = useQuizStore((s) => s.enterChallengeMode);
  const challengeDifficulty = useQuizStore((s) => s.challengeDifficulty);
  const selectChallengeDifficulty = useQuizStore((s) => s.selectChallengeDifficulty);
  const currentQuestionIndex = useQuizStore((s) => s.currentQuestionIndex);
  const questionStat = useQuizStore((s) => s.questionStat);
  const challengeScoring = useQuizStore((s) => s.challengeScoring);
  const challengeResult = useQuizStore((s) => s.challengeResult);
  const lastPointChange = useQuizStore((s) => s.lastPointChange);
  const startChallenge = useQuizStore((s) => s.startChallenge);
  const nextChallengeQuestion = useQuizStore((s) => s.nextChallengeQuestion);
  const addConnectionScore = useQuizStore((s) => s.addConnectionScore);
  const recordQuestionStat = useQuizStore((s) => s.recordQuestionStat);
  const addErrorItem = useQuizStore((s) => s.addErrorItem);
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
    if (!isChallengeMode || !challengeDifficulty) return null;
    return CHALLENGE_MODE_CONFIG[challengeDifficulty];
  }, [isChallengeMode, challengeDifficulty]);

  const currentQuestion = useMemo(() => {
    if (!currentChallengeConfig) return null;
    return currentChallengeConfig.question[currentQuestionIndex];
  }, [currentChallengeConfig, currentQuestionIndex]);

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
    duration: settings.timerDuration,
    enabled: settings.timerMode && !isChallengeMode,
    onTimeUp: handleTimeUp,
    isPaused: isChecked,
  });

  // Challenge timer
  const handleChallengeTimeUp = useCallback(() => {
    const stat = {
      correctConnection: score.correct,
      incorrectConnection: requiredConnections - score.correct,
      timeSpent: currentChallengeConfig?.timerDuration
        ? currentChallengeConfig.timerDuration * 1000
        : 0,
      isPerfect: false,
    };
    recordQuestionStat(stat);

    const missedConnections = requiredConnections - connectionCount;
    for (let i = 0; i < missedConnections; i++) {
      addConnectionScore(false);
    }

    if (currentQuestionIndex >= TOTAL_CHALLENGE_QUESTION - 1) {
      finishChallenge(
        challengeScoring.correctConnection +
          challengeScoring.incorrectConnection +
          missedConnections,
        Date.now(),
      );
    } else {
      nextChallengeQuestion();
    }
  }, [
    score.correct,
    requiredConnections,
    currentChallengeConfig,
    recordQuestionStat,
    connectionCount,
    addConnectionScore,
    currentQuestionIndex,
    finishChallenge,
    challengeScoring,
    nextChallengeQuestion,
  ]);

  const {
    timeRemaining: challengeTimeRemaining,
    start: startChallengeTimer,
    reset: resetChallengeTimer,
    stop: stopChallengeTimer,
    getElapsedTime,
  } = useChallengeTimer({
    duration: currentChallengeConfig?.timerDuration ?? 60,
    enabled: isChallengeMode && isStarted && !challengeResult,
    onTimeUp: handleChallengeTimeUp,
    isPaused: isChecked,
  });

  // Generate challenge question when index changes
  useEffect(() => {
    if (isChallengeMode && isStarted && currentQuestion && !challengeResult) {
      setSettings({
        lettersPerQuiz: currentQuestion.lettersPerQuiz,
        targetsPerQuiz: currentQuestion.targetsPerQuiz,
        multiEdge: currentQuestion.allowMultiEdge,
        timerMode: true,
        timerDuration: currentChallengeConfig?.timerDuration ?? 60,
      });

      generateQuiz(currentQuestion.mode);
      setMode(currentQuestion.mode);
      resetChallengeTimer();

      if (currentQuestionIndex === 0) {
        startChallengeTimer();
      }
    }
  }, [
    isChallengeMode,
    isStarted,
    currentQuestionIndex,
    currentQuestion,
    challengeResult,
    currentChallengeConfig,
    setSettings,
    generateQuiz,
    setMode,
    resetChallengeTimer,
    startChallengeTimer,
  ]);

  // Handlers
  const handleChallengeCheckAndNext = useCallback(() => {
    const { score: currentScore, incorrectItem } = checkAnswers();
    const timeSpent = getElapsedTime();
    const isPerfect = currentScore.correct === currentScore.total;

    recordQuestionStat({
      correctConnection: currentScore.correct,
      incorrectConnection: currentScore.total - currentScore.correct,
      timeSpent,
      isPerfect,
    });

    for (const item of incorrectItem) {
      addErrorItem(item.name, item.type);
    }

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
      if (currentQuestionIndex >= TOTAL_CHALLENGE_QUESTION - 1) {
        finishChallenge(
          challengeScoring.correctConnection +
            challengeScoring.incorrectConnection +
            currentScore.correct +
            (currentScore.total - currentScore.correct),
          endTime,
        );
      } else {
        nextChallengeQuestion();
      }
    }, animationDuration);
  }, [
    checkAnswers,
    getElapsedTime,
    recordQuestionStat,
    addErrorItem,
    addConnectionScore,
    currentQuestionIndex,
    challengeScoring,
    finishChallenge,
    nextChallengeQuestion,
  ]);

  const handleModeSelect = useCallback(
    (selectedMode: QuizMode) => {
      setMode(selectedMode);
    },
    [setMode],
  );

  const handleChallengeSelect = useCallback(() => {
    enterChallengeMode();
  }, [enterChallengeMode]);

  const handleDifficultySelect = useCallback(
    (difficulty: keyof typeof CHALLENGE_MODE_CONFIG) => {
      selectChallengeDifficulty(difficulty);
    },
    [selectChallengeDifficulty],
  );

  const handleStartChallenge = useCallback(() => {
    startChallenge();
  }, [startChallenge]);

  const handleStartQuiz = useCallback(() => {
    if (mode) {
      generateQuiz(mode);
      startQuiz();
      startTimer();
    }
  }, [mode, generateQuiz, startQuiz, startTimer]);

  const handleBackToModeSelect = useCallback(() => {
    setMode(null);
    resetChallenge();
  }, [setMode, resetChallenge]);

  const handleBackToDifficultySelect = useCallback(() => {
    resetChallenge();
    enterChallengeMode();
  }, [resetChallenge, enterChallengeMode]);

  const handleResetQuiz = useCallback(() => {
    setNodes([]);
    setEdges([]);
    resetQuiz();
    stopTimer();
    stopChallengeTimer();
    startTimer();
  }, [setNodes, setEdges, resetQuiz, stopTimer, stopChallengeTimer, startTimer]);

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
    enterChallengeMode();
    if (challengeDifficulty) {
      selectChallengeDifficulty(challengeDifficulty);
    }
  }, [
    setNodes,
    setEdges,
    resetChallenge,
    enterChallengeMode,
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
      showModeSelection: !mode && !isChallengeMode,
      showDifficultySelection: isChallengeMode && !challengeDifficulty,
      showChallengeReady: isChallengeMode && !!challengeDifficulty && !isStarted,
      showChallengeResults: isChallengeMode && !!challengeResult,
      showChallengeQuiz: isChallengeMode && isStarted && !challengeResult,
      showRegularSettings: !isChallengeMode && !!mode && !isStarted,
      showRegularQuiz: !isChallengeMode && !!mode && isStarted,
    }),
    [mode, isChallengeMode, challengeDifficulty, isStarted, challengeResult],
  );

  const { dialogTitle, dialogDescription } = useMemo(() => {
    let title = t('select_mode');
    let description = t('select_mode_description');

    if (isChallengeMode) {
      if (challengeResult) {
        title = t('challenge_result');
        description = '';
      } else if (!challengeDifficulty) {
        title = t('select_difficulty');
      } else if (!isStarted) {
        title = t('mode_challenge');
        description = t('seconds_per_question', {
          seconds: currentChallengeConfig?.timerDuration ?? 60,
        });
      } else {
        title = t('mode_challenge');
        description = mode ? t(`description_${mode}`) : '';
      }
    } else if (mode) {
      if (!isStarted) {
        title = t('settings');
        description = t('settings_description', {
          mode: mode === 'articulation_point' ? 'makhraj' : 'sifat',
        });
      } else {
        title = t(`title_${mode}`);
        description = t(`description_${mode}`);
      }
    }

    return { dialogTitle: title, dialogDescription: description };
  }, [
    isChallengeMode,
    challengeResult,
    challengeDifficulty,
    isStarted,
    mode,
    currentChallengeConfig,
    t,
  ]);

  return {
    // State
    mode,
    settings,
    setSettings,
    isDialogOpen,
    openDialog,
    isStarted,
    isChecked,
    isInstructionShown,
    setIsInstructionShown,
    score,
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
    isChallengeMode,
    challengeDifficulty,
    currentQuestionIndex,
    questionStat,
    challengeScoring,
    challengeResult,
    lastPointChange,
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
