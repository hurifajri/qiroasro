'use client';

import { useQuery } from '@tanstack/react-query';
import {
  addEdge,
  Background,
  BackgroundVariant,
  type Connection,
  type Edge,
  Handle,
  type Node,
  type NodeTypes,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { CheckCircle2Icon, RefreshCwIcon, TrophyIcon, XCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn, kebabToSnakeCase } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global';
import { getArticulationPointsOpt } from '@/queries/articulation';
import { getLetterArticulationsOpt, getLettersOpt, getLetterTraitsOpt } from '@/queries/letter';
import { getTraitsOpt } from '@/queries/trait';
import type { Letter } from '@/schemas/letter';

// Quiz mode: 'makhraj' or 'sifat'
type QuizMode = 'makhraj' | 'sifat';

// Question structure
interface QuizQuestion {
  letter: Letter;
  correctTargetIds: number[];
  targetType: QuizMode;
}

// Target item (makhraj or sifat)
interface TargetItem {
  id: number;
  slug: string;
}

// Constants
const LETTERS_PER_QUIZ = 5;
const TARGETS_PER_QUIZ = 6;

interface LetterQuizNodeProps {
  data: { label: string; symbol: string; status: string };
}

// Custom node for letter (source)
function LetterQuizNode({ data }: LetterQuizNodeProps) {
  return (
    <div
      className={cn(
        'flex h-14 w-14 items-center justify-center rounded-full border-2 font-bold text-2xl shadow-md transition-all',
        data.status === 'none' && 'border-amber-400 bg-amber-100 dark:bg-amber-900/50',
        data.status === 'correct' && 'border-green-500 bg-green-100 dark:bg-green-900/50',
        data.status === 'incorrect' && 'border-red-500 bg-red-100 dark:bg-red-900/50',
      )}
    >
      {data.symbol}
      {/* Bigger handle for touch devices */}
      <Handle
        type="source"
        position={Position.Right}
        className="size-4 border-2 border-amber-500 bg-amber-300"
      />
    </div>
  );
}

// Custom node for target (makhraj/sifat)
interface TargetQuizNodeProps {
  data: { label: string; mode: QuizMode; hasConnection: boolean; isCorrectTarget: boolean };
}

function TargetQuizNode({ data }: TargetQuizNodeProps) {
  return (
    <div
      className={cn(
        'flex min-w-30 items-center justify-center rounded-lg border-2 px-3 py-3 font-medium text-sm shadow-md transition-all',
        data.mode === 'makhraj' && 'border-sky-400 bg-sky-100 dark:bg-sky-900/50',
        data.mode === 'sifat' && 'border-violet-400 bg-violet-100 dark:bg-violet-900/50',
        data.hasConnection &&
          data.isCorrectTarget &&
          'border-green-500 bg-green-100 dark:bg-green-900/50',
        data.hasConnection &&
          !data.isCorrectTarget &&
          'border-red-500 bg-red-100 dark:bg-red-900/50',
      )}
    >
      {/* Bigger handle for touch devices */}
      <Handle
        type="target"
        position={Position.Left}
        className={cn(
          'size-4 border-2',
          data.mode === 'makhraj' && 'border-sky-500 bg-sky-300',
          data.mode === 'sifat' && 'border-violet-500 bg-violet-300',
        )}
      />
      {data.label}
    </div>
  );
}

const nodeTypes: NodeTypes = {
  letterQuiz: LetterQuizNode,
  targetQuiz: TargetQuizNode,
};

export function GraphQuiz() {
  const t = useTranslations();
  const { theme } = useGlobalStore((state) => state);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quizMode, setQuizMode] = useState<QuizMode | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [, setTargets] = useState<TargetItem[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Fetch data
  const { data: letters = [] } = useQuery(getLettersOpt());
  const { data: letterArticulations = [] } = useQuery(getLetterArticulationsOpt());
  const { data: letterTraits = [] } = useQuery(getLetterTraitsOpt());
  const { data: articulationPoints = [] } = useQuery(getArticulationPointsOpt());
  const { data: traits = [] } = useQuery(getTraitsOpt());

  // Get formatted name for target (use slug with formatting)
  const getTargetName = useCallback((slug: string, _mode: QuizMode) => {
    // Format slug: replace hyphens with spaces and capitalize
    return slug.replace(/-/g, ' ');
  }, []);

  // Generate quiz questions and nodes
  const generateQuiz = useCallback(
    (mode: QuizMode) => {
      // Filter letters that have relationships
      const availableLetters = letters.filter((letter) => {
        if (mode === 'makhraj') {
          return letterArticulations.some((la) => la.letterId === letter.id);
        } else {
          return letterTraits.some((lt) => lt.letterId === letter.id);
        }
      });

      // Shuffle and pick letters
      const shuffledLetters = [...availableLetters].sort(() => Math.random() - 0.5);
      const selectedLetters = shuffledLetters.slice(0, LETTERS_PER_QUIZ);

      // Generate questions
      const newQuestions: QuizQuestion[] = selectedLetters.map((letter) => {
        let correctTargetIds: number[];

        if (mode === 'makhraj') {
          correctTargetIds = letterArticulations
            .filter((la) => la.letterId === letter.id)
            .map((la) => la.pointId);
        } else {
          correctTargetIds = letterTraits
            .filter((lt) => lt.letterId === letter.id)
            .map((lt) => lt.traitId);
        }

        return {
          letter,
          correctTargetIds,
          targetType: mode,
        };
      });

      // Collect all correct targets
      const allCorrectTargetIds = new Set(newQuestions.flatMap((q) => q.correctTargetIds));

      // Get target items
      let allTargets: TargetItem[];
      if (mode === 'makhraj') {
        allTargets = articulationPoints.map((ap) => ({ id: ap.id, slug: ap.slug }));
      } else {
        allTargets = traits.map((t) => ({ id: t.id, slug: t.slug }));
      }

      // Ensure we include all correct targets + some distractors
      const correctTargets = allTargets.filter((t) => allCorrectTargetIds.has(t.id));
      const distractors = allTargets
        .filter((t) => !allCorrectTargetIds.has(t.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.max(0, TARGETS_PER_QUIZ - correctTargets.length));

      const selectedTargets = [...correctTargets, ...distractors]
        .sort(() => Math.random() - 0.5)
        .slice(0, TARGETS_PER_QUIZ);

      // Create nodes for ReactFlow
      const letterNodes: Node[] = newQuestions.map((q, index) => ({
        id: `letter-${q.letter.id}`,
        type: 'letterQuiz',
        position: { x: 50, y: 30 + index * 70 },
        data: {
          label: t(`global.letter.${kebabToSnakeCase(q.letter.slug)}`),
          symbol: q.letter.symbol,
          status: 'none',
        },
        draggable: false,
      }));

      const targetNodes: Node[] = selectedTargets.map((target, index) => ({
        id: `target-${target.id}`,
        type: 'targetQuiz',
        position: { x: 280, y: 20 + index * 60 },
        data: {
          label: getTargetName(target.slug, mode),
          mode: mode,
          hasConnection: false,
          isCorrectTarget: false,
        },
        draggable: false,
      }));

      setQuestions(newQuestions);
      setTargets(selectedTargets);
      setNodes([...letterNodes, ...targetNodes]);
      setEdges([]);
      setIsChecked(false);
      setScore({ correct: 0, total: 0 });
    },
    [
      letters,
      letterArticulations,
      letterTraits,
      articulationPoints,
      traits,
      getTargetName,
      setNodes,
      setEdges,
      t,
    ],
  );

  // Validate connection - ensure letter connects to valid targets only
  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      // Only allow connections from letters to targets
      const sourceId = connection.source;
      const targetId = connection.target;

      if (!sourceId?.startsWith('letter-') || !targetId?.startsWith('target-')) {
        return false;
      }

      // Check if this letter already has a connection
      const existingConnection = edges.find((e) => e.source === sourceId);
      if (existingConnection) {
        return false;
      }

      return true;
    },
    [edges],
  );

  // Handle new connection
  const onConnect = useCallback(
    (connection: Connection) => {
      if (isChecked) return;

      // Remove existing connection from this letter (if any)
      const newEdges = edges.filter((e) => e.source !== connection.source);

      // Add new connection with styled edge
      if (!connection.source || !connection.target) return;

      const newEdge: Edge = {
        ...connection,
        id: `${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        style: { stroke: '#f59e0b', strokeWidth: 2 },
        animated: true,
      };

      setEdges(addEdge(newEdge, newEdges));
    },
    [edges, isChecked, setEdges],
  );

  // Start quiz
  const startQuiz = (mode: QuizMode) => {
    setQuizMode(mode);
    generateQuiz(mode);
  };

  // Reset to mode selection
  const resetQuiz = () => {
    setQuizMode(null);
    setQuestions([]);
    setTargets([]);
    setNodes([]);
    setEdges([]);
    setIsChecked(false);
    setScore({ correct: 0, total: 0 });
  };

  // Check answers
  const checkAnswers = useCallback(() => {
    let correctCount = 0;
    const totalQuestions = questions.length;
    const connectionResults: Map<string, 'correct' | 'incorrect'> = new Map();

    for (const question of questions) {
      const letterId = `letter-${question.letter.id}`;
      const connection = edges.find((e) => e.source === letterId);

      if (connection) {
        const targetIdNum = Number.parseInt(connection.target.replace('target-', ''), 10);
        const isCorrect = question.correctTargetIds.includes(targetIdNum);

        connectionResults.set(letterId, isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
          correctCount++;
        }
      }
    }

    // Update node styles based on results
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.type === 'letterQuiz') {
          const status = connectionResults.get(node.id) || 'none';
          return {
            ...node,
            data: {
              ...node.data,
              status,
            },
          };
        }

        if (node.type === 'targetQuiz') {
          // Check if this target has any connection
          const hasConnection = edges.some((e) => e.target === node.id);
          const targetIdNum = Number.parseInt(node.id.replace('target-', ''), 10);

          // Check if the connection to this target is correct
          let isCorrectTarget = false;
          if (hasConnection) {
            const connectionToThis = edges.find((e) => e.target === node.id);
            if (connectionToThis) {
              const letterIdNum = Number.parseInt(
                connectionToThis.source.replace('letter-', ''),
                10,
              );
              const question = questions.find((q) => q.letter.id === letterIdNum);
              isCorrectTarget = question?.correctTargetIds.includes(targetIdNum) || false;
            }
          }

          return {
            ...node,
            data: {
              ...node.data,
              hasConnection,
              isCorrectTarget,
            },
          };
        }

        return node;
      }),
    );

    // Update edge styles
    setEdges((currentEdges) =>
      currentEdges.map((edge) => {
        const letterIdNum = Number.parseInt(edge.source.replace('letter-', ''), 10);
        const targetIdNum = Number.parseInt(edge.target.replace('target-', ''), 10);
        const question = questions.find((q) => q.letter.id === letterIdNum);
        const isCorrect = question?.correctTargetIds.includes(targetIdNum) || false;

        return {
          ...edge,
          style: {
            stroke: isCorrect ? '#22c55e' : '#ef4444',
            strokeWidth: 3,
          },
          animated: false,
        };
      }),
    );

    setScore({ correct: correctCount, total: totalQuestions });
    setIsChecked(true);
  }, [questions, edges, setNodes, setEdges]);

  // Count current connections
  const connectionCount = useMemo(() => edges.length, [edges]);

  return (
    <>
      <Button
        id="tour-quiz-button"
        onClick={() => setIsDialogOpen(true)}
        className="cursor-pointer bg-linear-to-r from-accent-sky to-accent-sky-dark text-base text-white"
      >
        <TrophyIcon />
        {t('playground_page.quiz.trigger')}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {quizMode
                ? t(`playground_page.quiz.title_${quizMode}`)
                : t('playground_page.quiz.select_mode')}
            </DialogTitle>
            <DialogDescription>
              {quizMode
                ? t(`playground_page.quiz.description_${quizMode}`)
                : t('playground_page.quiz.select_mode_description')}
            </DialogDescription>
          </DialogHeader>

          {!quizMode ? (
            // Mode selection
            <div className="flex flex-col gap-4 py-4">
              <Button
                onClick={() => startQuiz('makhraj')}
                variant="outline"
                className="h-20 text-lg"
              >
                <span className="text-2xl">🎯</span>
                {t('playground_page.quiz.mode_makhraj')}
              </Button>
              <Button onClick={() => startQuiz('sifat')} variant="outline" className="h-20 text-lg">
                <span className="text-2xl">✨</span>
                {t('playground_page.quiz.mode_sifat')}
              </Button>
            </div>
          ) : (
            // Quiz area
            <div className="flex flex-col gap-4">
              {/* Score display */}
              {isChecked && (
                <div className="flex items-center justify-center gap-2 rounded-lg bg-muted p-3">
                  {score.correct === score.total ? (
                    <CheckCircle2Icon className="text-green-500" />
                  ) : (
                    <XCircleIcon className="text-red-500" />
                  )}
                  <span className="font-semibold text-lg">
                    {t('playground_page.quiz.score', {
                      correct: score.correct,
                      total: score.total,
                    })}
                  </span>
                </div>
              )}

              {/* ReactFlow Quiz canvas */}
              <div className="h-100 overflow-hidden rounded-lg border bg-muted/30">
                <ReactFlowProvider>
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    isValidConnection={isValidConnection}
                    nodeTypes={nodeTypes}
                    colorMode={theme}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                    nodesDraggable={false}
                    nodesConnectable={!isChecked}
                    elementsSelectable={false}
                    panOnDrag={false}
                    zoomOnScroll={false}
                    zoomOnPinch={false}
                    zoomOnDoubleClick={false}
                    preventScrolling={false}
                    proOptions={{ hideAttribution: true }}
                    // Touch device support - tap two handles to connect
                    connectOnClick={true}
                  >
                    <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
                  </ReactFlow>
                </ReactFlowProvider>
              </div>

              {/* Instructions */}
              {!isChecked && (
                <p className="text-center text-muted-foreground text-sm">
                  {t('playground_page.quiz.instruction')}
                </p>
              )}
            </div>
          )}

          {quizMode && (
            <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
              <Button variant="outline" onClick={resetQuiz}>
                <RefreshCwIcon className="mr-2 h-4 w-4" />
                {t('playground_page.quiz.change_mode')}
              </Button>
              <div className="flex gap-2">
                {isChecked ? (
                  <Button onClick={() => generateQuiz(quizMode)} variant="default">
                    <RefreshCwIcon className="mr-2 h-4 w-4" />
                    {t('playground_page.quiz.try_again')}
                  </Button>
                ) : (
                  <Button
                    onClick={checkAnswers}
                    disabled={connectionCount < questions.length}
                    variant="default"
                  >
                    <CheckCircle2Icon className="mr-2 h-4 w-4" />
                    {t('playground_page.quiz.check_answer')}
                  </Button>
                )}
              </div>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
