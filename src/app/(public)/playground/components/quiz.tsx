'use client';

import { type NodeTypes, ReactFlowProvider } from '@xyflow/react';
import { TrophyIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
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
import { QuizContentRegular } from './quiz-content-regular';
import { QuizModeSelector } from './quiz-mode-selector';

const nodeTypes: NodeTypes = {
  letterQuiz: LetterQuizNode,
  targetQuiz: TargetQuizNode,
};

export function Quiz() {
  const t = useTranslations('playground_page.quiz');
  const quiz = useQuiz();

  return (
    <ReactFlowProvider>
      <Button
        id="tour-quiz"
        size="sm"
        onClick={quiz.openDialog}
        className="bg-linear-to-r from-accent-sky to-accent-sky-dark text-white"
      >
        <TrophyIcon className="size-4" />
        {t('trigger')}
      </Button>

      <Dialog open={quiz.isDialogOpen} onOpenChange={quiz.handleDialogClose}>
        <DialogContent
          className={cn(
            'flex max-w-lg flex-col rounded-none sm:rounded-xl',
            quiz.isStarted && 'min-h-full min-w-full justify-between sm:min-w-auto',
            quiz.screenState.showChallengeResults && quiz.challengeResult
              ? 'justify-between overflow-hidden px-0'
              : 'overflow-y-auto',
          )}
        >
          <DialogHeader>
            <DialogTitle>{quiz.dialogTitle}</DialogTitle>
            {quiz.dialogDescription && (
              <DialogDescription>{quiz.dialogDescription}</DialogDescription>
            )}
          </DialogHeader>

          {quiz.screenState.showModeSelection && (
            <QuizModeSelector
              onSelect={quiz.handleModeSelect}
              onChallengeSelect={quiz.handleChallengeSelect}
            />
          )}

          {quiz.isChallengeMode ? (
            <QuizContentChallenge quiz={quiz} nodeTypes={nodeTypes} />
          ) : (
            <QuizContentRegular quiz={quiz} nodeTypes={nodeTypes} />
          )}
        </DialogContent>
      </Dialog>
    </ReactFlowProvider>
  );
}
