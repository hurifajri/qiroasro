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

import { useQuizChallenge } from '../_hooks/use-quiz-challenge';
import { useQuizGenerator } from '../_hooks/use-quiz-generator';
import { useQuizPractice } from '../_hooks/use-quiz-practice';
import { useQuizStore } from '../_providers/quiz';
import { LetterQuizNode } from './node-letter-quiz';
import { TargetQuizNode } from './node-target-quiz';
import { QuizContentChallenge } from './quiz-content-challenge';
import { QuizContentPractice } from './quiz-content-practice';
import { QuizModeSelector } from './quiz-mode-selector';

const nodeTypes: NodeTypes = {
  letterQuiz: LetterQuizNode,
  targetQuiz: TargetQuizNode,
};

type QuizTranslator = ReturnType<
  typeof useTranslations<'playground_page.quiz'>
>;

function getPracticeDialogMeta(
  t: QuizTranslator,
  type: string,
  isStarted: boolean,
) {
  if (!isStarted) {
    return {
      dialogTitle: t('practice_settings_title'),
      dialogDescription: t(`practice_settings_description_${type}`),
    };
  }
  return {
    dialogTitle: t(`practice_title_${type}`),
    dialogDescription: t(`practice_description_${type}`),
  };
}

function getChallengeDialogMeta(
  t: QuizTranslator,
  challengeDifficulty: unknown,
  isStarted: boolean,
  challengeResult: unknown,
) {
  if (!challengeDifficulty) {
    return {
      dialogTitle: t('challenge_select_difficulty_title'),
      dialogDescription: t('challenge_select_difficulty_description'),
    };
  }
  if (!isStarted) {
    return {
      dialogTitle: t('challenge_confirm_title'),
      dialogDescription: '',
    };
  }
  if (!challengeResult) {
    return {
      dialogTitle: t('challenge_title'),
      dialogDescription: t('challenge_description'),
    };
  }
  return { dialogTitle: '', dialogDescription: '' };
}

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
  const { onConnect, requiredConnection, isValidConnection } = generator;

  // Practice hook
  const practice = useQuizPractice({ setNodes, setEdges, generator });
  const {
    handleCheckAnswer: handleCheckAnswerPractice,
    handleStart: handleStartPractice,
    handlePlayAgain: handlePlayAgainPractice,
    handleChangeMode: handleChangeModePractice,
    stopTimer: stopTimerPractice,
    timeRemaining: timeRemainingPractice,
  } = practice;

  // Challenge hook
  const challenge = useQuizChallenge({ setNodes, setEdges, generator });
  const {
    handleCheckAndNext: handleCheckAndNextChallenge,
    handlePlayAgain: handlePlayAgainChallenge,
    handleChangeMode: handleChangeModeChallenge,
    stopTimer: stopTimerChallenge,
    timeRemaining: timeRemainingChallenge,
  } = challenge;

  function handleCloseDialog(open: boolean) {
    if (open) return;

    // Determine if quiz was completed based on current state
    // const completed =
    //   mode === 'practice'
    //     ? isChecked
    //     : mode === 'challenge' && !!challengeResult;

    // trackEvent('quiz_dialog_closed', { locale, theme, mode, completed });

    stopTimerPractice();
    stopTimerChallenge();
    resetAll();
  }

  const { dialogTitle, dialogDescription } = useMemo(() => {
    if (mode === 'practice' && type) {
      return getPracticeDialogMeta(t, type, isStarted);
    }
    if (mode === 'challenge') {
      return getChallengeDialogMeta(
        t,
        challengeDifficulty,
        isStarted,
        challengeResult,
      );
    }
    return {
      dialogTitle: t('select_mode_title'),
      dialogDescription: t('select_mode_description'),
    };
  }, [mode, challengeResult, challengeDifficulty, isStarted, type, t]);

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
        {dialogTitle && (
          <DialogHeader
            className={cn(
              '',
              mode === 'challenge' && challengeResult && 'px-4',
            )}
          >
            <DialogTitle>{dialogTitle}</DialogTitle>
            {dialogDescription ? (
              <DialogDescription>{dialogDescription}</DialogDescription>
            ) : (
              <DialogDescription className="sr-only">
                {dialogTitle}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        {!mode && !type && <QuizModeSelector />}

        <ReactFlowProvider>
          {mode === 'practice' && (
            <QuizContentPractice
              nodes={nodes}
              nodeTypes={nodeTypes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              isValidConnection={isValidConnection}
              requiredConnection={requiredConnection}
              timeRemaining={timeRemainingPractice}
              handleStart={handleStartPractice}
              handleCheckAnswer={handleCheckAnswerPractice}
              handleChangeMode={handleChangeModePractice}
              handlePlayAgain={handlePlayAgainPractice}
            />
          )}

          {mode === 'challenge' && (
            <QuizContentChallenge
              nodes={nodes}
              nodeTypes={nodeTypes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              isValidConnection={isValidConnection}
              requiredConnection={requiredConnection}
              timeRemaining={timeRemainingChallenge}
              handleCheckAndNext={handleCheckAndNextChallenge}
              handleChangeMode={handleChangeModeChallenge}
              handlePlayAgain={handlePlayAgainChallenge}
            />
          )}
        </ReactFlowProvider>
      </DialogContent>
    </Dialog>
  );
}
