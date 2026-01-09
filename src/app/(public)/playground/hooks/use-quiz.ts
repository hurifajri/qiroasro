'use client';

import type { Edge, Node } from '@xyflow/react';
import { useEdgesState, useNodesState } from '@xyflow/react';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';
import { useQuizStore } from '../providers/quiz';
import { useQuizChallenge } from './use-quiz-challenge';
import { useQuizGenerator } from './use-quiz-generator';
import { useQuizPractice } from './use-quiz-practice';

export function useQuiz() {
  const t = useTranslations('playground_page.quiz');

  // Store selectors
  const isDialogOpen = useQuizStore((s) => s.isDialogOpen);
  const openDialog = useQuizStore((s) => s.openDialog);
  const isInstructionShown = useQuizStore((s) => s.isInstructionShown);
  const setIsInstructionShown = useQuizStore((s) => s.setIsInstructionShown);
  const resetAll = useQuizStore((s) => s.resetAll);

  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const generator = useQuizGenerator({ nodes, edges, setNodes, setEdges });
  const { isValidConnection, onConnect, connectionCount, requiredConnections } = generator;

  // Challenge hook
  const challenge = useQuizChallenge({ setNodes, setEdges, generator });
  const {
    isChallenge,
    challengeDifficulty,
    challengeCurrQuestionIdx,
    challengeQuestionScores,
    challengeScore,
    challengeResult,
    challengeLastPointChange,
    challengeTimeRemaining,
    currentChallengeConfig,
    handleChallengeSelect,
    handleDifficultySelect,
    handleStartChallenge,
    handleBackToDifficultySelect,
    handlePlayAgainChallenge,
    handleChallengeCheckAndNext,
    stopChallengeTimer,
    resetChallenge,
  } = challenge;

  // Practice hook
  const practice = useQuizPractice({ setNodes, setEdges, generator, isChallenge });
  const {
    mode,
    practiceSettings,
    setPracticeSettings,
    isStarted,
    isChecked,
    practiceScore,
    timeRemaining,
    handleModeSelect,
    handleStartQuiz,
    handleResetQuiz: practiceResetQuiz,
    handlePlayAgainPractice,
    checkAnswers,
    generateQuiz,
    stopTimer,
    setMode,
  } = practice;

  // Combined handlers
  const handleBackToModeSelect = useCallback(() => {
    setMode(null);
    resetChallenge();
  }, [setMode, resetChallenge]);

  const handleResetQuiz = useCallback(() => {
    practiceResetQuiz(stopChallengeTimer);
  }, [practiceResetQuiz, stopChallengeTimer]);

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

  const handleBackToMenu = useCallback(() => {
    setNodes([]);
    setEdges([]);
    resetAll();
  }, [setNodes, setEdges, resetAll]);

  // Screen state
  const screenState = useMemo(
    () => ({
      showModeSelection: !mode && !isChallenge,
      showDifficultySelection: isChallenge && !challengeDifficulty,
      showChallengeReady: isChallenge && !!challengeDifficulty && !isStarted,
      showChallengeResults: isChallenge && !!challengeResult,
      showChallengeQuiz: isChallenge && isStarted && !challengeResult,
      showPracticeSettings: !isChallenge && !!mode && !isStarted,
      showPracticeQuiz: !isChallenge && !!mode && isStarted,
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
        description = mode ? t('practice_description', { mode: 'makhraj/sifat' }) : '';
      }
    } else if (mode) {
      if (!isStarted) {
        title = t('practice_settings');
        description = t('practice_settings_description', {
          mode: mode === 'articulation_point' ? 'makharijul huruf' : 'sifatul huruf',
        });
      } else {
        title = t('practice_title', {
          mode: mode === 'articulation_point' ? 'Makharijul Huruf' : 'Sifatul Huruf',
        });
        description = t('practice_description', {
          mode: mode === 'articulation_point' ? 'makhraj' : 'sifat',
        });
      }
    }

    return { dialogTitle: title, dialogDescription: description };
  }, [isChallenge, challengeResult, challengeDifficulty, isStarted, mode, t]);

  return {
    // State
    mode,
    practiceSettings,
    setPracticeSettings,
    isDialogOpen,
    openDialog,
    isStarted,
    isChecked,
    isInstructionShown,
    setIsInstructionShown,
    practiceScore,
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
    handlePlayAgainChallenge,
    handleBackToMenu,
    handleChallengeCheckAndNext,
    handlePlayAgainPractice,
    checkAnswers,
    generateQuiz,

    // Screen state
    screenState,
    dialogTitle,
    dialogDescription,
  };
}
