'use client';

import {
  type Edge,
  type Node,
  type NodeTypes,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useQuizChallenge } from '../hooks/use-quiz-challenge';
import { useQuizGenerator } from '../hooks/use-quiz-generator';
import { useQuizPractice } from '../hooks/use-quiz-practice';
import { useQuizStore } from '../providers/quiz';
import { LetterQuizNode } from './node-letter-quiz';
import { TargetQuizNode } from './node-target-quiz';
import { QuizContentChallenge } from './quiz-content-challenge';
import { QuizContentPractice } from './quiz-content-practice';
import { QuizModeSelector } from './quiz-mode-selector';

const nodeTypes: NodeTypes = {
  letterQuiz: LetterQuizNode,
  targetQuiz: TargetQuizNode,
};

export function Quiz() {
  const t = useTranslations('playground_page.quiz');

  const isDialogOpen = useQuizStore((s) => s.isDialogOpen);
  const mode = useQuizStore((s) => s.mode);
  const type = useQuizStore((s) => s.type);
  const isStarted = useQuizStore((s) => s.isStarted);
  const resetAll = useQuizStore((s) => s.resetAll);
  const challengeDifficulty = useQuizStore((s) => s.challengeDifficulty);
  const challengeResult = useQuizStore((s) => s.challengeResult);

  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const generator = useQuizGenerator({ nodes, edges, setNodes, setEdges });
  const {
    checkAnswers,
    onConnect,
    requiredConnections,
    isValidConnection,
    connectionCount,
  } = generator;

  // Challenge hook
  const challenge = useQuizChallenge({ setNodes, setEdges, generator });
  const {
    handleSelectDifficulty: handleSelectDifficultyChallenge,
    handleStart: handleStartChallenge,
    handleCheckAndNext: handleCheckAndNextChallenge,
    handlePlayAgain: handlePlayAgainChallenge,
    handleBack: handleBackChallenge,
    stopTimer: stopTimerChallenge,
    timeRemaining: timeRemainingChallenge,
  } = challenge;

  // Practice hook
  const practice = useQuizPractice({ setNodes, setEdges, generator });
  const {
    handleStart: handleStartPractice,
    handleReset: handleResetPractice,
    handlePlayAgain: handlePlayAgainPractice,
    stopTimer: stopTimerPractice,
    timeRemaining: timeRemainingPractice,
  } = practice;

  function handleCloseDialog(open: boolean) {
    if (open) return;

    resetAll();
    stopTimerPractice();
    stopTimerChallenge();
  }

  function handleBackToMenu() {
    setNodes([]);
    setEdges([]);
    resetAll();
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <t won't change>
  const { dialogTitle, dialogDescription } = useMemo(() => {
    let title = t('select_mode');
    let description = t('select_mode_description');

    if (mode === 'challenge') {
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
        description = type
          ? t('practice_description', { type: 'makhraj/sifat' })
          : '';
      }
    } else if (mode === 'practice' && type) {
      if (!isStarted) {
        title = t('practice_settings');
        description = t('practice_settings_description', {
          type:
            type === 'articulation_point'
              ? 'makharijul huruf'
              : 'sifatul huruf',
        });
      } else {
        title = t('practice_title', {
          type:
            type === 'articulation_point'
              ? 'Makharijul Huruf'
              : 'Sifatul Huruf',
        });
        description = t('practice_description', {
          type: type === 'articulation_point' ? 'makhraj' : 'sifat',
        });
      }
    }

    return { dialogTitle: title, dialogDescription: description };
  }, [mode, challengeResult, challengeDifficulty, isStarted, type]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
      <DialogContent
        className={cn(
          'flex max-w-full flex-col rounded-none sm:rounded-xl',
          isStarted && 'min-h-full min-w-full justify-between sm:min-w-auto',
          mode === 'challenge' && challengeResult
            ? 'overflow-hidden px-0'
            : 'overflow-y-auto',
        )}
      >
        <DialogHeader
          className={cn('', mode === 'challenge' && challengeResult && 'px-4')}
        >
          <DialogTitle>{dialogTitle}</DialogTitle>
          {dialogDescription && (
            <DialogDescription>{dialogDescription}</DialogDescription>
          )}
        </DialogHeader>

        {!mode && !type && <QuizModeSelector />}

        <ReactFlowProvider>
          {mode === 'challenge' ? (
            <QuizContentChallenge
              nodes={nodes}
              nodeTypes={nodeTypes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              isValidConnection={isValidConnection}
              connectionCount={connectionCount}
              requiredConnections={requiredConnections}
              timeRemaining={timeRemainingChallenge}
              handleSelectDifficulty={handleSelectDifficultyChallenge}
              handleStart={handleStartChallenge}
              handleCheckAndNext={handleCheckAndNextChallenge}
              handleBack={handleBackChallenge}
              handleBackToMenu={handleBackToMenu}
              handlePlayAgain={handlePlayAgainChallenge}
            />
          ) : (
            <QuizContentPractice
              nodes={nodes}
              nodeTypes={nodeTypes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              isValidConnection={isValidConnection}
              connectionCount={connectionCount}
              requiredConnections={requiredConnections}
              timeRemaining={timeRemainingPractice}
              handleStart={handleStartPractice}
              handleReset={handleResetPractice}
              handlePlayAgain={handlePlayAgainPractice}
              handleCheckAnswers={checkAnswers}
            />
          )}
        </ReactFlowProvider>
      </DialogContent>
    </Dialog>
  );
}
