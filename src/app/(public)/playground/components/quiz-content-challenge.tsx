'use client';

import type { NodeTypes } from '@xyflow/react';
import { PlayIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useGlobalStore } from '@/providers/global';
import type { useQuiz } from '../hooks/use-quiz';
import { ChallengeDifficultySelector } from './challenge-difficulty-selector';
import { ChallengeProgress } from './challenge-progress';
import { ChallengeResults } from './challenge-results';
import { PointAnimation } from './point-animation';
import { QuizContent } from './quiz-content';
import { QuizTimer } from './quiz-timer';

const TOTAL_CHALLENGE_QUESTION = 10;

type QuizHook = ReturnType<typeof useQuiz>;

interface QuizContentChallengeProps {
  quiz: QuizHook;
  nodeTypes: NodeTypes;
}

export function QuizContentChallenge({ quiz, nodeTypes }: QuizContentChallengeProps) {
  const t = useTranslations('playground_page.quiz');
  const theme = useGlobalStore((s) => s.theme);

  return (
    <>
      <PointAnimation lastPointChange={quiz.lastPointChange} />

      {quiz.screenState.showDifficultySelection && (
        <div className="flex flex-col gap-4">
          <ChallengeDifficultySelector onSelect={quiz.handleDifficultySelect} />
          <Button variant="outline" onClick={quiz.handleBackToModeSelect}>
            {t('back')}
          </Button>
        </div>
      )}

      {quiz.screenState.showChallengeReady && (
        <div className="flex flex-col gap-4">
          <div className="rounded-lg bg-muted/50 p-4 text-center">
            <p className="text-muted-foreground text-sm">
              {t('total_question_count', {
                count: quiz.currentChallengeConfig?.question.length ?? 10,
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={quiz.handleBackToDifficultySelect}
              className="flex-1"
            >
              {t('back')}
            </Button>
            <Button onClick={quiz.handleStartChallenge} className="flex-1">
              <PlayIcon className="size-4" />
              {t('start_quiz')}
            </Button>
          </div>
        </div>
      )}

      {quiz.screenState.showChallengeResults && quiz.challengeResult && (
        <ChallengeResults
          result={quiz.challengeResult}
          onPlayAgain={quiz.handlePlayAgain}
          onBackToMenu={quiz.handleBackToMenu}
        />
      )}

      {quiz.screenState.showChallengeQuiz && (
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
              <>
                <ChallengeProgress
                  currentIndex={quiz.currentQuestionIndex}
                  totalQuestion={TOTAL_CHALLENGE_QUESTION}
                  questionStat={quiz.questionStat}
                />
                <div className="flex h-9 items-center justify-between gap-2">
                  <span className="font-medium text-sm">
                    {t('point', { point: quiz.challengeScoring.totalPoint })}
                  </span>
                  {quiz.challengeTimeRemaining !== null && (
                    <QuizTimer timeRemaining={quiz.challengeTimeRemaining} />
                  )}
                </div>
              </>
            }
          />
          <div className="flex gap-2">
            <Button
              onClick={quiz.handleChallengeCheckAndNext}
              disabled={quiz.connectionCount < quiz.requiredConnections || quiz.isChecked}
              className="flex-1"
            >
              {t('check_answer')}
            </Button>
          </div>
        </>
      )}
    </>
  );
}
