'use client';

import {
  type Edge,
  type Node,
  type NodeTypes,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { TrophyIcon, XCircleIcon } from 'lucide-react';
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
import { useGlobalStore } from '@/providers/global';
import { useQuizGenerator } from '../hooks/use-quiz-generator';
import { useQuizTimer } from '../hooks/use-quiz-timer';
import type { QuizMode, QuizQuestion, QuizScore, TargetItem } from '../schemas/graph';
import { LetterQuizNode } from './node-letter-quiz';
import { TargetQuizNode } from './node-target-quiz';
import { QuizCanvas } from './quiz-canvas';
import { QuizFooter } from './quiz-footer';
import { QuizInstruction } from './quiz-instruction';
import { QuizModeSelector } from './quiz-mode-selector';
import { QuizSettings, type QuizSettingsValues } from './quiz-settings';
import { QuizTimer } from './quiz-timer';

const nodeTypes: NodeTypes = {
  letterQuiz: LetterQuizNode,
  targetQuiz: TargetQuizNode,
};

const DEFAULT_SETTINGS: QuizSettingsValues = {
  lettersPerQuiz: 1,
  targetsPerQuiz: 2,
  multiEdge: false,
  timerMode: false,
  timerDuration: 15,
};

export function Quiz() {
  const t = useTranslations('playground_page.quiz');
  const { theme } = useGlobalStore((state) => state);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [settings, setSettings] = useState<QuizSettingsValues>(DEFAULT_SETTINGS);
  const [quizMode, setQuizMode] = useState<QuizMode | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [, setTargets] = useState<TargetItem[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isUnsupportedConfig, setIsUnsupportedConfig] = useState(false);
  const [score, setScore] = useState<QuizScore>({ correct: 0, total: 0 });
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

  const startQuiz = (mode: QuizMode) => {
    setQuizMode(mode);
    generateQuiz(mode);
    startTimer();
  };

  const resetQuiz = () => {
    setQuizMode(null);
    setQuestions([]);
    setTargets([]);
    setNodes([]);
    setEdges([]);
    setIsChecked(false);
    setScore({ correct: 0, total: 0 });
    stopTimer();
  };

  return (
    <ReactFlowProvider>
      <Button
        id="tour-quiz"
        size="sm"
        onClick={() => setIsDialogOpen(true)}
        className="bg-linear-to-r from-accent-sky to-accent-sky-dark text-white"
      >
        <TrophyIcon className="size-4" />
        {t('trigger')}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-hidden">
          <DialogHeader>
            <DialogTitle>{quizMode ? t(`title_${quizMode}`) : t('select_mode')}</DialogTitle>
            <DialogDescription>
              {quizMode ? t(`description_${quizMode}`) : t('select_mode_description')}
            </DialogDescription>
          </DialogHeader>

          {!quizMode ? (
            <div className="flex flex-col gap-4">
              <QuizSettings values={settings} onChange={setSettings} />
              <QuizModeSelector onSelect={startQuiz} />
            </div>
          ) : isUnsupportedConfig ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <XCircleIcon className="h-16 w-16 text-muted-foreground" />
              <p className="text-center text-muted-foreground">{t('unsupported_quiz')}</p>
            </div>
          ) : (
            <div className="relative flex flex-col gap-4">
              {settings.timerMode && timeRemaining !== null && !isChecked && (
                <QuizTimer timeRemaining={timeRemaining} />
              )}

              <QuizCanvas
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                theme={theme}
                isChecked={isChecked}
                score={score}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                isValidConnection={isValidConnection}
              />

              {isInstructionShown && (
                <QuizInstruction quizMode={quizMode} onClose={() => setIsInstructionShown(false)} />
              )}
            </div>
          )}

          {quizMode && (
            <QuizFooter
              isUnsupportedConfig={isUnsupportedConfig}
              isChecked={isChecked}
              connectionCount={connectionCount}
              requiredConnections={requiredConnections}
              onReset={resetQuiz}
              onTryAgain={() => {
                generateQuiz(quizMode);
                resetTimer();
              }}
              onCheckAnswers={checkAnswers}
              timerMode={settings.timerMode}
              timeRemaining={timeRemaining}
            />
          )}
        </DialogContent>
      </Dialog>
    </ReactFlowProvider>
  );
}
