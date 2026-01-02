'use client';

import type { NodeTypes } from '@xyflow/react';
import { CheckCircle2Icon, PlayIcon, RefreshCwIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { useGlobalStore } from '@/providers/global';
import type { useQuiz } from '../hooks/use-quiz';
import { QuizContent } from './quiz-content';
import { QuizInstruction } from './quiz-instruction';
import { QuizScore } from './quiz-score';
import { QuizSettings } from './quiz-settings';
import { QuizTimer } from './quiz-timer';

type QuizHook = ReturnType<typeof useQuiz>;

interface QuizContentRegularProps {
  quiz: QuizHook;
  nodeTypes: NodeTypes;
}

export function QuizContentRegular({ quiz, nodeTypes }: QuizContentRegularProps) {
  const t = useTranslations('playground_page.quiz');
  const theme = useGlobalStore((s) => s.theme);

  // Step 1: Settings
  if (quiz.screenState.showRegularSettings) {
    return (
      <>
        <QuizSettings />
        <DialogFooter className="flex flex-row items-center">
          <Button
            size="lg"
            variant="outline"
            onClick={quiz.handleBackToModeSelect}
            className="flex-1"
          >
            {t('back')}
          </Button>
          <Button size="lg" onClick={quiz.handleStartQuiz} className="flex-1">
            <PlayIcon />
            {t('start_quiz')}
          </Button>
        </DialogFooter>
      </>
    );
  }

  // Step 2: Quiz
  if (quiz.screenState.showRegularQuiz) {
    return (
      <>
        <QuizContent
          nodes={quiz.nodes}
          edges={quiz.edges}
          nodeTypes={nodeTypes}
          theme={theme}
          isChecked={quiz.isChecked}
          onNodesChange={quiz.onNodesChange}
          onEdgesChange={quiz.onEdgesChange}
          onConnect={quiz.onConnect}
          isValidConnection={quiz.isValidConnection}
          headerContent={
            <div className="flex h-14 items-center justify-end gap-2 px-2">
              {quiz.isChecked && <QuizScore variant="regular" score={quiz.score} />}
              {quiz.settings.timerMode && quiz.timeRemaining !== null && !quiz.isChecked && (
                <QuizTimer timeRemaining={quiz.timeRemaining} />
              )}
            </div>
          }
        />
        <DialogFooter className="flex-col! gap-4">
          {quiz.isInstructionShown && quiz.mode && (
            <QuizInstruction
              quizMode={quiz.mode}
              onClose={() => quiz.setIsInstructionShown(false)}
            />
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              size="lg"
              variant="outline"
              onClick={quiz.handleResetQuiz}
              className="sm:flex-1"
            >
              <RefreshCwIcon />
              {t('change_mode')}
            </Button>
            {quiz.isChecked ? (
              <Button size="lg" onClick={quiz.handleTryAgain} className="sm:flex-1">
                <RefreshCwIcon />
                {t('try_again')}
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={quiz.checkAnswers}
                disabled={quiz.connectionCount < quiz.requiredConnections}
                className="sm:flex-1"
              >
                <CheckCircle2Icon />
                {t('check_answer')}
              </Button>
            )}
          </div>
        </DialogFooter>
      </>
    );
  }

  return null;
}
