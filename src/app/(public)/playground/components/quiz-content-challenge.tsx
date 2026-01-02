'use client';

import type { NodeTypes } from '@xyflow/react';
import { CheckCircle2Icon, PlayIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { useGlobalStore } from '@/providers/global';
import type { useQuiz } from '../hooks/use-quiz';
import { CHALLENGE_QUESTION } from '../schemas/quiz';
import { ChallengeDifficultySelector } from './challenge-difficulty-selector';
import { ChallengeProgress } from './challenge-progress';
import { ChallengeResults } from './challenge-results';
import { PointAnimation } from './point-animation';
import { QuizContent } from './quiz-content';
import { QuizInstruction } from './quiz-instruction';
import { QuizScore } from './quiz-score';
import { QuizTimer } from './quiz-timer';

const TOTAL_CHALLENGE_QUESTION = CHALLENGE_QUESTION.length;

type QuizHook = ReturnType<typeof useQuiz>;

interface QuizContentChallengeProps {
  quiz: QuizHook;
  nodeTypes: NodeTypes;
}

export function QuizContentChallenge({ quiz, nodeTypes }: QuizContentChallengeProps) {
  const t = useTranslations('playground_page.quiz');
  const theme = useGlobalStore((s) => s.theme);

  // Step 1: Difficulty Selection
  if (quiz.screenState.showDifficultySelection) {
    return (
      <>
        <ChallengeDifficultySelector onSelect={quiz.handleDifficultySelect} />
        <DialogFooter>
          <Button size="lg" variant="outline" onClick={quiz.handleBackToModeSelect}>
            {t('back')}
          </Button>
        </DialogFooter>
      </>
    );
  }

  // Step 2: Challenge instructions
  if (quiz.screenState.showChallengeReady && quiz.currentChallengeConfig) {
    console.log('quiz.isInstructionShown', quiz.isInstructionShown);
    console.log('quiz.mode', quiz.mode);
    return (
      <>
        <div className="flex flex-col">
          <p className="text-muted-foreground text-sm">
            {t('seconds_per_question', {
              seconds: quiz.currentChallengeConfig.timerDuration,
            })}
          </p>
          <p className="text-muted-foreground text-sm">
            {t('total_question_count', {
              count: quiz.currentChallengeConfig.question.length,
            })}
          </p>

          <QuizInstruction quizMode={quiz.mode} />
        </div>
        <DialogFooter className="flex flex-row items-center">
          <Button
            size="lg"
            variant="outline"
            onClick={quiz.handleBackToDifficultySelect}
            className="flex-1"
          >
            {t('back')}
          </Button>
          <Button size="lg" onClick={quiz.handleStartChallenge} className="flex-1">
            <PlayIcon />
            {t('start_quiz')}
          </Button>
        </DialogFooter>
      </>
    );
  }

  // Step 3: Challenge
  if (quiz.screenState.showChallengeQuiz) {
    return (
      <>
        <PointAnimation lastPointChange={quiz.lastPointChange} />
        <ChallengeProgress
          currentIndex={quiz.currentQuestionIndex}
          totalQuestion={TOTAL_CHALLENGE_QUESTION}
          questionStat={quiz.questionStat}
        />
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
            <div className="flex h-12 items-center justify-between gap-2 px-2">
              <QuizScore variant="challenge" totalPoint={quiz.challengeScoring.totalPoint} />
              {quiz.challengeTimeRemaining !== null && (
                <QuizTimer timeRemaining={quiz.challengeTimeRemaining} />
              )}
            </div>
          }
        />
        <DialogFooter className="flex flex-row items-center">
          <Button
            size="lg"
            onClick={quiz.handleChallengeCheckAndNext}
            disabled={quiz.connectionCount < quiz.requiredConnections || quiz.isChecked}
            className="flex-1"
          >
            <CheckCircle2Icon />
            {t('check_answer')}
          </Button>
        </DialogFooter>
      </>
    );
  }

  // Step 4: Challenge Results
  if (quiz.screenState.showChallengeResults && quiz.challengeResult) {
    return (
      <ChallengeResults
        result={quiz.challengeResult}
        onPlayAgain={quiz.handlePlayAgain}
        onBackToMenu={quiz.handleBackToMenu}
      />
    );
  }

  return null;
}
