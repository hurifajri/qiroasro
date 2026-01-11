'use client';

import type {
  Edge,
  IsValidConnection,
  Node,
  NodeTypes,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from '@xyflow/react';
import { CheckCircle2Icon, PlayIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { useGlobalStore } from '@/providers/global';
import { useQuizStore } from '../providers/quiz';
import {
  CHALLENGE_QUIZ_LEVEL,
  CHALLENGE_QUIZ_QUESTIONS,
  type ChallengeQuizDifficulty,
} from '../schemas/quiz';
import { ChallengeDifficultySelector } from './challenge-difficulty-selector';
import { ChallengeProgress } from './challenge-progress';
import { ChallengeResults } from './challenge-results';
import { PointAnimation } from './point-animation';
import { QuizContent } from './quiz-content';
import { QuizInstruction } from './quiz-instruction';
import { QuizScore } from './quiz-score';
import { QuizTimer } from './quiz-timer';

const TOTAL_CHALLENGE_QUESTION = CHALLENGE_QUIZ_QUESTIONS.length;

type ChallengeProps = {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: OnConnect;
  isValidConnection: IsValidConnection;
  connectionCount: number;
  requiredConnections: number;
  timeRemaining: number | null;
  handleCheckAndNext: () => void;
};

type QuizContentChallengeProps = ChallengeProps & {
  handleSelectDifficulty: (difficulty: ChallengeQuizDifficulty) => void;
  handleStart: () => void;
  handleBackToMenu: () => void;
  handlePlayAgain: () => void;
};

/**
 * Separate component for quiz content to use refs for measuring
 */
function Challenge({
  nodes,
  nodeTypes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  isValidConnection,
  connectionCount,
  requiredConnections,
  timeRemaining,
  handleCheckAndNext,
}: ChallengeProps) {
  const t = useTranslations('playground_page.quiz');
  const theme = useGlobalStore((s) => s.theme);

  const isChecked = useQuizStore((s) => s.isChecked);
  const currQuestionIdx = useQuizStore((s) => s.challengeCurrQuestionIdx);
  const questionScores = useQuizStore((s) => s.challengeQuestionScores);
  const score = useQuizStore((s) => s.challengeScore);
  const lastPointChange = useQuizStore((s) => s.challengeLastPointChange);

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
        <PointAnimation lastPointChange={lastPointChange} />
        <ChallengeProgress
          currQuestionIdx={currQuestionIdx}
          totalQuestion={TOTAL_CHALLENGE_QUESTION}
          questionScores={questionScores}
        />
      </div>
      <QuizContent
        mode="challenge"
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        theme={theme}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        extraTopOffset={extraTopOffset}
        headerContent={
          <>
            <QuizScore mode="challenge" totalPoint={score.totalPoint} />
            {timeRemaining !== null && (
              <QuizTimer timeRemaining={timeRemaining} />
            )}
          </>
        }
      />
      <DialogFooter className="flex flex-row items-center rounded-b-none sm:rounded-b-xl">
        <Button
          size="lg"
          onClick={handleCheckAndNext}
          disabled={connectionCount < requiredConnections || isChecked}
          className="flex-1"
        >
          <CheckCircle2Icon />
          {t('check_answer')}
        </Button>
      </DialogFooter>
    </>
  );
}

export function QuizContentChallenge({
  nodes,
  edges,
  nodeTypes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  isValidConnection,
  connectionCount,
  requiredConnections,
  timeRemaining,
  handleSelectDifficulty,
  handleStart,
  handleCheckAndNext,
  handleBackToMenu,
  handlePlayAgain,
}: QuizContentChallengeProps) {
  const t = useTranslations('playground_page.quiz');

  const type = useQuizStore((s) => s.type);
  const setMode = useQuizStore((s) => s.setMode);
  const setType = useQuizStore((s) => s.setType);
  const selectDifficulty = useQuizStore((s) => s.selectChallengeDifficulty);
  const isStarted = useQuizStore((s) => s.isStarted);
  const result = useQuizStore((s) => s.challengeResult);
  const difficulty = useQuizStore((s) => s.challengeDifficulty);

  function handleBackToSelectMode() {
    setMode(null);
    setType(null);
  }

  function handleBackToSelectDifficulty() {
    selectDifficulty(null);
  }

  // Step 1: Difficulty Selection
  if (!difficulty) {
    return (
      <>
        <ChallengeDifficultySelector onSelect={handleSelectDifficulty} />
        <DialogFooter className="flex flex-row items-center rounded-b-none sm:rounded-b-xl">
          <Button
            size="lg"
            variant="outline"
            onClick={handleBackToSelectMode}
            className="flex-1"
          >
            {t('back')}
          </Button>
        </DialogFooter>
      </>
    );
  }

  // Step 2: Challenge instructions
  if (difficulty && !isStarted) {
    const currentChallengeConfig = CHALLENGE_QUIZ_LEVEL[difficulty];

    return (
      <>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <p className="font-medium text-sm">
              {`${t('challenge_total_question_count', {
                count: currentChallengeConfig.questions.length,
              })}. ${t('challenge_seconds_per_question', {
                seconds: currentChallengeConfig.timerDuration,
              })}`}
            </p>
          </div>

          <QuizInstruction quizType={type} />
        </div>
        <DialogFooter className="flex flex-row items-center rounded-b-none sm:rounded-b-xl">
          <Button
            size="lg"
            variant="outline"
            onClick={handleBackToSelectDifficulty}
            className="flex-1"
          >
            {t('back')}
          </Button>
          <Button size="lg" onClick={handleStart} className="flex-1">
            <PlayIcon />
            {t('start_quiz')}
          </Button>
        </DialogFooter>
      </>
    );
  }

  // Step 3: Challenge
  if (isStarted && !result) {
    return (
      <Challenge
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        connectionCount={connectionCount}
        requiredConnections={requiredConnections}
        timeRemaining={timeRemaining}
        handleCheckAndNext={handleCheckAndNext}
      />
    );
  }

  // Step 4: Challenge Results
  if (result) {
    return (
      <ChallengeResults
        result={result}
        onPlayAgain={handlePlayAgain}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  return null;
}
