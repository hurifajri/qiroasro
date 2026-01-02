'use client';

import type { NodeTypes } from '@xyflow/react';
import { PlayIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global';
import type { useQuiz } from '../hooks/use-quiz';
import { QuizContent } from './quiz-content';
import { QuizFooterRegular } from './quiz-footer-regular';
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

  if (quiz.screenState.showRegularSettings) {
    return (
      <div className="flex flex-col gap-4">
        <QuizSettings />
        <div className="flex gap-2">
          <Button variant="outline" onClick={quiz.handleBackToModeSelect} className="flex-1">
            {t('back')}
          </Button>
          <Button onClick={quiz.handleStartQuiz} className="flex-1">
            <PlayIcon className="size-4" />
            {t('start_quiz')}
          </Button>
        </div>
      </div>
    );
  }

  if (quiz.screenState.showRegularQuiz) {
    return (
      <>
        <QuizContent
          nodes={quiz.nodes}
          edges={quiz.edges}
          nodeTypes={nodeTypes}
          theme={theme}
          isChecked={quiz.isChecked}
          isInstructionShown={quiz.isInstructionShown}
          mode={quiz.mode}
          onNodesChange={quiz.onNodesChange}
          onEdgesChange={quiz.onEdgesChange}
          onConnect={quiz.onConnect}
          isValidConnection={quiz.isValidConnection}
          onInstructionClose={() => quiz.setIsInstructionShown(false)}
          headerContent={
            <div
              className={cn(
                'flex h-9 items-center gap-2',
                quiz.isChecked ? 'justify-between' : 'justify-end',
              )}
            >
              {quiz.isChecked && <QuizScore score={quiz.score} />}
              {quiz.settings.timerMode && quiz.timeRemaining !== null && !quiz.isChecked && (
                <QuizTimer timeRemaining={quiz.timeRemaining} />
              )}
            </div>
          }
        />
        <QuizFooterRegular
          isChecked={quiz.isChecked}
          connectionCount={quiz.connectionCount}
          requiredConnections={quiz.requiredConnections}
          onReset={quiz.handleResetQuiz}
          onTryAgain={() => quiz.mode && quiz.generateQuiz(quiz.mode)}
          onCheckAnswers={quiz.checkAnswers}
          timerMode={quiz.settings.timerMode}
          timeRemaining={quiz.timeRemaining}
        />
      </>
    );
  }

  return null;
}
