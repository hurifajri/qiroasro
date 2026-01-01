'use client';

import {
  type Edge,
  type Node,
  type NodeTypes,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { PlayIcon, TrophyIcon, XCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global';
import { useQuizGenerator } from '../hooks/use-quiz-generator';
import { useQuizTimer } from '../hooks/use-quiz-timer';
import { useQuizStore } from '../providers/quiz';
import type { QuizMode, QuizQuestion, QuizScoreCount, TargetItem } from '../schemas/quiz';
import { LetterQuizNode } from './node-letter-quiz';
import { TargetQuizNode } from './node-target-quiz';
import { QuizCanvas } from './quiz-canvas';
import { QuizFooter } from './quiz-footer';
import { QuizInstruction } from './quiz-instruction';
import { QuizModeSelector } from './quiz-mode-selector';
import { QuizScore } from './quiz-score';
import { QuizSettings } from './quiz-settings';
import { QuizTimer } from './quiz-timer';

const nodeTypes: NodeTypes = {
  letterQuiz: LetterQuizNode,
  targetQuiz: TargetQuizNode,
};

export function Quiz() {
  const t = useTranslations('playground_page.quiz');
  const { theme } = useGlobalStore((state) => state);

  // Zustand store state
  const mode = useQuizStore((s) => s.mode);
  const setMode = useQuizStore((s) => s.setMode);
  const settings = useQuizStore((s) => s.settings);
  const isDialogOpen = useQuizStore((s) => s.isDialogOpen);
  const openDialog = useQuizStore((s) => s.openDialog);
  const resetAll = useQuizStore((s) => s.resetAll);

  // Local state for quiz internals (nodes/edges managed by ReactFlow)
  const [isStarted, setIsStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [, setTargets] = useState<TargetItem[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isUnsupportedConfig, setIsUnsupportedConfig] = useState(false);
  const [score, setScore] = useState<QuizScoreCount>({ correct: 0, total: 0 });
  const [isInstructionShown, setIsInstructionShown] = useState(true);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const {
    generateQuiz,
    isValidConnection,
    onConnect,
    checkAnswers,
    connectionCount,
    requiredConnections,
  } = useQuizGenerator({
    lettersPerQuiz: settings.lettersPerQuiz,
    targetsPerQuiz: settings.targetsPerQuiz,
    multiEdge: settings.multiEdge,
    nodes,
    edges,
    questions,
    isChecked,
    setNodes,
    setEdges,
    setQuestions,
    setTargets,
    setIsUnsupportedConfig,
    setIsChecked,
    setScore,
  });

  const handleTimeUp = useCallback(() => {
    if (!isChecked) {
      checkAnswers();
    }
  }, [isChecked, checkAnswers]);

  const {
    timeRemaining,
    start: startTimer,
    reset: resetTimer,
    stop: stopTimer,
  } = useQuizTimer({
    duration: settings.timerDuration,
    enabled: settings.timerMode,
    onTimeUp: handleTimeUp,
    isPaused: isChecked,
  });

  // New flow: Mode Selection → Settings → Start Quiz
  const handleModeSelect = (selectedMode: QuizMode) => {
    setMode(selectedMode);
  };

  const handleStartQuiz = () => {
    if (!mode) return;
    setIsStarted(true);
    generateQuiz(mode);
    startTimer();
  };

  const handleBackToModeSelect = () => {
    setMode(null);
    setIsStarted(false);
  };

  const resetQuiz = () => {
    setMode(null);
    setIsStarted(false);
    setQuestions([]);
    setTargets([]);
    setNodes([]);
    setEdges([]);
    setIsChecked(false);
    setScore({ correct: 0, total: 0 });
    stopTimer();
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetQuiz();
      resetAll();
    }
  };

  // Determine title and description based on state
  const getDialogTitle = () => {
    if (!mode) return t('select_mode');
    if (!isStarted) return t('settings');
    return t(`title_${mode}`);
  };

  const getDialogDescription = () => {
    if (!mode) return t('select_mode_description');
    if (!isStarted) return t(`description_${mode}`);
    return t(`description_${mode}`);
  };

  return (
    <ReactFlowProvider>
      <Button
        id="tour-quiz"
        size="sm"
        onClick={openDialog}
        className="bg-linear-to-r from-accent-sky to-accent-sky-dark text-white"
      >
        <TrophyIcon className="size-4" />
        {t('trigger')}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-hidden">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>{getDialogDescription()}</DialogDescription>
          </DialogHeader>

          {/* Step 1: Mode Selection */}
          {!mode && <QuizModeSelector onSelect={handleModeSelect} />}

          {/* Step 2: Settings (after mode selected, before quiz started) */}
          {mode && !isStarted && (
            <div className="flex flex-col gap-4">
              <QuizSettings />
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBackToModeSelect} className="flex-1">
                  {t('back')}
                </Button>
                <Button onClick={handleStartQuiz} className="flex-1">
                  <PlayIcon className="size-4" />
                  {t('start_quiz')}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Quiz Started */}
          {mode && isStarted && (
            <>
              {isUnsupportedConfig ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <XCircleIcon className="h-16 w-16 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">{t('unsupported_quiz')}</p>
                </div>
              ) : (
                <div className="relative flex flex-col gap-2">
                  <div
                    className={cn(
                      'flex h-9 items-center gap-2',
                      isChecked ? 'justify-between' : 'justify-end',
                    )}
                  >
                    {isChecked && <QuizScore score={score} />}
                    {settings.timerMode && timeRemaining !== null && !isChecked && (
                      <QuizTimer timeRemaining={timeRemaining} />
                    )}
                  </div>

                  <QuizCanvas
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    theme={theme}
                    isChecked={isChecked}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    isValidConnection={isValidConnection}
                  />

                  {isInstructionShown && (
                    <QuizInstruction quizMode={mode} onClose={() => setIsInstructionShown(false)} />
                  )}
                </div>
              )}

              <QuizFooter
                isUnsupportedConfig={isUnsupportedConfig}
                isChecked={isChecked}
                connectionCount={connectionCount}
                requiredConnections={requiredConnections}
                onReset={resetQuiz}
                onTryAgain={() => {
                  generateQuiz(mode);
                  resetTimer();
                }}
                onCheckAnswers={checkAnswers}
                timerMode={settings.timerMode}
                timeRemaining={timeRemaining}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </ReactFlowProvider>
  );
}
