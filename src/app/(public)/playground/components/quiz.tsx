'use client';

import { type Edge, type Node, type NodeTypes, useEdgesState, useNodesState } from '@xyflow/react';
import { TrophyIcon, XCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGlobalStore } from '@/providers/global';
import {
  type QuizQuestion,
  type QuizScore,
  type TargetItem,
  useQuizGenerator,
} from '../hooks/use-quiz-generator';
import type { QuizMode } from '../schemas/graph';
import { LetterQuizNode } from './node-letter-quiz';
import { TargetQuizNode } from './node-target-quiz';
import { QuizCanvas } from './quiz-canvas';
import { QuizFooter } from './quiz-footer';
import { QuizInstruction } from './quiz-instruction';
import { QuizModeSelector } from './quiz-mode-selector';

const LETTERS_PER_QUIZ: number = 3;
const TARGETS_PER_QUIZ: number = 1;
const MULTI_EDGE: boolean = false;

const nodeTypes: NodeTypes = {
  letterQuiz: LetterQuizNode,
  targetQuiz: TargetQuizNode,
};

export function Quiz() {
  const t = useTranslations('playground_page.quiz');
  const { theme } = useGlobalStore((state) => state);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    lettersPerQuiz: LETTERS_PER_QUIZ,
    targetsPerQuiz: TARGETS_PER_QUIZ,
    multiEdge: MULTI_EDGE,
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

  const startQuiz = (mode: QuizMode) => {
    setQuizMode(mode);
    generateQuiz(mode);
  };

  const resetQuiz = () => {
    setQuizMode(null);
    setQuestions([]);
    setTargets([]);
    setNodes([]);
    setEdges([]);
    setIsChecked(false);
    setScore({ correct: 0, total: 0 });
  };

  return (
    <>
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
            <QuizModeSelector onSelect={startQuiz} />
          ) : isUnsupportedConfig ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <XCircleIcon className="h-16 w-16 text-muted-foreground" />
              <p className="text-center text-muted-foreground">{t('unsupported_quiz')}</p>
            </div>
          ) : (
            <div className="relative flex flex-col gap-4">
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
              onTryAgain={() => generateQuiz(quizMode)}
              onCheckAnswers={checkAnswers}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
