'use client';

import type { NodeTypes } from '@xyflow/react';
import { CheckCircle2Icon, PlayIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
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

/**
 * Separate component for quiz content to use refs for measuring
 */
function ChallengeQuizContent({ quiz, nodeTypes }: { quiz: QuizHook; nodeTypes: NodeTypes }) {
  const t = useTranslations('playground_page.quiz');
  const theme = useGlobalStore((s) => s.theme);

  const topContentRef = useRef<HTMLDivElement>(null);
  const [extraTopOffset, setExtraTopOffset] = useState(0);

  useEffect(() => {
    const measureTopContent = () => {
      if (topContentRef.current) {
        setExtraTopOffset(topContentRef.current.offsetHeight);
      }
    };

    measureTopContent();

    const observer = new ResizeObserver(measureTopContent);
    if (topContentRef.current) {
      observer.observe(topContentRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={topContentRef}>
        <PointAnimation lastPointChange={quiz.lastPointChange} />
        <ChallengeProgress
          currentIndex={quiz.currentQuestionIndex}
          totalQuestion={TOTAL_CHALLENGE_QUESTION}
          questionStat={quiz.questionStat}
        />
      </div>
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
        isChallengeMode
        extraTopOffset={extraTopOffset}
        headerContent={
          <>
            <QuizScore variant="challenge" totalPoint={quiz.challengeScoring.totalPoint} />
            {quiz.challengeTimeRemaining !== null && (
              <QuizTimer timeRemaining={quiz.challengeTimeRemaining} />
            )}
          </>
        }
      />
      <DialogFooter className="flex flex-row items-center rounded-b-none sm:rounded-b-xl">
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

export function QuizContentChallenge({ quiz, nodeTypes }: QuizContentChallengeProps) {
  const t = useTranslations('playground_page.quiz');

  // Step 1: Difficulty Selection
  if (quiz.screenState.showDifficultySelection) {
    return (
      <>
        <ChallengeDifficultySelector onSelect={quiz.handleDifficultySelect} />
        <DialogFooter className="flex flex-row items-center rounded-b-none sm:rounded-b-xl">
          <Button
            size="lg"
            variant="outline"
            onClick={quiz.handleBackToModeSelect}
            className="flex-1"
          >
            {t('back')}
          </Button>
        </DialogFooter>
      </>
    );
  }

  // Step 2: Challenge instructions
  if (quiz.screenState.showChallengeReady && quiz.currentChallengeConfig) {
    return (
      <>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <p className="font-medium text-sm">
              {`${t('challenge_total_question_count', {
                count: quiz.currentChallengeConfig.question.length,
              })}. ${t('challenge_seconds_per_question', {
                seconds: quiz.currentChallengeConfig.timerDuration,
              })}`}
            </p>
          </div>

          <QuizInstruction quizMode={quiz.mode} />
        </div>
        <DialogFooter className="flex flex-row items-center rounded-b-none sm:rounded-b-xl">
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
    return <ChallengeQuizContent quiz={quiz} nodeTypes={nodeTypes} />;
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
