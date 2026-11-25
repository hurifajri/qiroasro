'use client';

import type {
  ColorMode,
  Edge,
  IsValidConnection,
  Node,
  NodeTypes,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from '@xyflow/react';
import { CheckCircle2Icon, PlayIcon, RefreshCwIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { useMounted } from '@/hooks/use-mounted';

import { useQuizStore } from '../providers/quiz';
import { QuizContent } from './quiz-content';
import { QuizInstruction } from './quiz-instruction';
import { QuizScore } from './quiz-score';
import { QuizSettings } from './quiz-settings';
import { QuizTimer } from './quiz-timer';

interface QuizContentPracticeProps {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: OnConnect;
  isValidConnection: IsValidConnection;
  requiredConnection: number;
  timeRemaining: number | null;
  handleStart: () => void;
  handleChangeMode: () => void;
  handlePlayAgain: () => void;
  handleCheckAnswer: () => void;
}

export function QuizContentPractice({
  nodes,
  edges,
  nodeTypes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  isValidConnection,
  requiredConnection,
  timeRemaining,
  handleStart,
  handleChangeMode,
  handlePlayAgain,
  handleCheckAnswer,
}: Readonly<QuizContentPracticeProps>) {
  const t = useTranslations('playground_page.quiz');
  const { theme } = useTheme();
  const { isMounted } = useMounted();
  const colorMode = (isMounted ? theme : 'light') as ColorMode;

  const type = useQuizStore((s) => s.type);
  const setMode = useQuizStore((s) => s.setMode);
  const setType = useQuizStore((s) => s.setType);
  const isStarted = useQuizStore((s) => s.isStarted);
  const isChecked = useQuizStore((s) => s.isChecked);
  const isInstructionShown = useQuizStore((s) => s.isInstructionShown);
  const setIsInstructionShown = useQuizStore((s) => s.setIsInstructionShown);
  const settings = useQuizStore((s) => s.practiceSettings);
  const score = useQuizStore((s) => s.practiceScore);

  function handleBackToSelectMode() {
    setMode(null);
    setType(null);
  }

  // Step 1: Settings
  if (type && !isStarted) {
    return (
      <>
        <QuizSettings />
        <DialogFooter className="flex flex-row items-center rounded-b-none sm:rounded-b-xl">
          <Button
            size="lg"
            variant="outline"
            onClick={handleBackToSelectMode}
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

  // Step 2: Quiz
  if (type && isStarted) {
    return (
      <>
        <QuizContent
          mode="practice"
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          theme={colorMode}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          isValidConnection={isValidConnection}
          headerContent={
            <>
              {isChecked && <QuizScore mode="practice" score={score} />}
              {settings.timerMode && timeRemaining !== null && !isChecked && (
                <QuizTimer timeRemaining={timeRemaining} />
              )}
            </>
          }
        />
        <DialogFooter className="flex-col! gap-4 rounded-b-none sm:rounded-b-xl">
          {isInstructionShown && (
            <QuizInstruction
              quizType={type}
              onClose={() => setIsInstructionShown(false)}
            />
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              size="lg"
              variant="outline"
              onClick={handleChangeMode}
              className="sm:flex-1"
            >
              <RefreshCwIcon />
              {t('change_mode')}
            </Button>
            {isChecked ? (
              <Button size="lg" onClick={handlePlayAgain} className="sm:flex-1">
                <RefreshCwIcon />
                {t('try_again')}
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleCheckAnswer}
                disabled={edges.length < requiredConnection}
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
