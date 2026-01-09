'use client';

import { type NodeTypes, ReactFlowProvider } from '@xyflow/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useQuiz } from '../hooks/use-quiz';
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
  const quiz = useQuiz();

  // Determine if we need ReactFlow (only when quiz canvas is actually shown)
  const needsReactFlow = quiz.screenState.showPracticeQuiz || quiz.screenState.showChallengeQuiz;

  // Quiz content that may or may not need ReactFlowProvider
  const quizContent = (
    <>
      {quiz.screenState.showModeSelection && (
        <QuizModeSelector
          onSelect={quiz.handleModeSelect}
          onChallengeSelect={quiz.handleChallengeSelect}
        />
      )}

      {quiz.isChallenge ? (
        <QuizContentChallenge quiz={quiz} nodeTypes={nodeTypes} />
      ) : (
        <QuizContentPractice quiz={quiz} nodeTypes={nodeTypes} />
      )}
    </>
  );

  return (
    <Dialog open={quiz.isDialogOpen} onOpenChange={quiz.handleDialogClose}>
      <DialogContent
        className={cn(
          'flex max-w-full flex-col rounded-none sm:rounded-xl',
          quiz.isStarted && 'min-h-full min-w-full justify-between sm:min-w-auto',
          quiz.screenState.showChallengeResults && quiz.challengeResult
            ? 'overflow-hidden px-0'
            : 'overflow-y-auto',
        )}
      >
        <DialogHeader
          className={cn(
            '',
            quiz.screenState.showChallengeResults && quiz.challengeResult && 'px-4',
          )}
        >
          <DialogTitle>{quiz.dialogTitle}</DialogTitle>
          {quiz.dialogDescription && (
            <DialogDescription>{quiz.dialogDescription}</DialogDescription>
          )}
        </DialogHeader>

        {/*
            Performance optimization: Only mount ReactFlowProvider when quiz canvas is shown.
            This prevents ReactFlow overhead when browsing settings/mode selection.
          */}
        {needsReactFlow ? <ReactFlowProvider>{quizContent}</ReactFlowProvider> : quizContent}
      </DialogContent>
    </Dialog>
  );
}
