'use client';

import { useQuery } from '@tanstack/react-query';
import {
  addEdge,
  Background,
  BackgroundVariant,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
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
import { kebabToSpaced } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global';
import type { Letter } from '@/schemas/letter';
import { createLetterQuizNode, createTargetQuizNode } from '../lib/node';
import { getPlaygroundDataOpt } from '../queries/playground';
import type { QuizMode } from '../schemas/graph';
import type { LetterQuiz } from '../schemas/letter';
import type { TargetQuiz } from '../schemas/node';
import { LetterQuizNode } from './node-letter-quiz';
import { TargetQuizNode } from './node-target-quiz';

interface QuizQuestion {
  letter: Letter;
  correctTargetIds: number[];
  targetType: QuizMode;
}

interface TargetItem {
  id: number;
  slug: string;
}

const LETTERS_PER_QUIZ = 2;
const TARGETS_PER_QUIZ = 1;

const nodeTypes: NodeTypes = {
  letterQuiz: LetterQuizNode,
  targetQuiz: TargetQuizNode,
};

export function GraphQuiz() {
  const t = useTranslations('playground_page.quiz');
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

  // Fetch data from single consolidated query
  const { data: playgroundData } = useQuery(getPlaygroundDataOpt());
  const letters = playgroundData?.letters ?? [];
  const letterArticulations = playgroundData?.letterArticulations ?? [];
  const letterTraits = playgroundData?.letterTraits ?? [];
  const articulationPoints = playgroundData?.articulationPoints ?? [];
  const traits = playgroundData?.traits ?? [];

  // Generate quiz questions and nodes
  const generateQuiz = useCallback(
    (mode: QuizMode) => {
      // Filter letters that have relationships
      // For sifat mode, exclude letters that only have traits with groupId 7
      const validTraitIds = new Set(traits.filter((t) => t.groupId !== 7).map((t) => t.id));
      const availableLetters = letters.filter((letter) => {
        if (mode === 'makhraj') {
          return letterArticulations.some((la) => la.letterId === letter.id);
        } else {
          return letterTraits.some(
            (lt) => lt.letterId === letter.id && validTraitIds.has(lt.traitId),
          );
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
          // Exclude traits with groupId 7 from quiz (using validTraitIds from above)
          correctTargetIds = letterTraits
            .filter((lt) => lt.letterId === letter.id && validTraitIds.has(lt.traitId))
            .map((lt) => lt.traitId);
        }

        return { letter, correctTargetIds, targetType: mode };
      });

      // Get target items
      let allTargets: TargetItem[];
      if (mode === 'makhraj') {
        allTargets = articulationPoints.map((ap) => ({ id: ap.id, slug: ap.slug }));
      } else {
        // Exclude traits with groupId 7 from quiz (using validTraitIds from above)
        allTargets = traits
          .filter((t) => validTraitIds.has(t.id))
          .map((t) => ({ id: t.id, slug: t.slug }));
      }

      // Collect ALL correct target IDs for selected letters (to exclude from distractors)
      const allCorrectTargetIds = new Set(newQuestions.flatMap((q) => q.correctTargetIds));

      // For each question, pick only ONE correct target randomly
      // This ensures each letter has exactly one correct answer
      const selectedCorrectIds = new Set<number>();
      const updatedQuestions = newQuestions.map((q) => {
        // Shuffle correct targets and pick only one
        const shuffledCorrectIds = [...q.correctTargetIds].sort(() => Math.random() - 0.5);
        const singleCorrectId = shuffledCorrectIds[0];
        selectedCorrectIds.add(singleCorrectId);
        return { ...q, correctTargetIds: [singleCorrectId] };
      });

      // Update questions with single correct answer
      newQuestions.length = 0;
      newQuestions.push(...updatedQuestions);

      // Get correct targets (only the selected ones)
      const correctTargets = allTargets.filter((t) => selectedCorrectIds.has(t.id));

      // Get distractors - exclude ALL correct targets for the letter, not just selected one
      // This ensures distractors are truly wrong answers
      const distractors = allTargets
        .filter((t) => !allCorrectTargetIds.has(t.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.max(0, TARGETS_PER_QUIZ - correctTargets.length));

      const selectedTargets = [...correctTargets, ...distractors]
        .sort(() => Math.random() - 0.5)
        .slice(0, TARGETS_PER_QUIZ);

      // Create nodes for ReactFlow
      const letterNodes: Node[] = newQuestions.map((q, index) => {
        const letter: LetterQuiz = { ...q.letter, status: 'none' };
        const position = { x: 50, y: 30 + index * 70 };
        return createLetterQuizNode(letter, position);
      });

      const targetNodes: Node[] = selectedTargets.map((q, index) => {
        const target: TargetQuiz = { id: q.id, label: kebabToSpaced(q.slug), mode, status: 'none' };
        const position = { x: 280, y: 20 + index * 60 };
        return createTargetQuizNode(target, position);
      });

      setQuestions(newQuestions);
      setTargets(selectedTargets);
      setNodes([...letterNodes, ...targetNodes]);
      setEdges([]);
      setIsChecked(false);
      setScore({ correct: 0, total: 0 });
    },
    [letters, letterArticulations, letterTraits, articulationPoints, traits, setNodes, setEdges],
  );

  // Validate connection - ensure letter connects to valid targets only
  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      // Only allow connections from letters to targets
      const sourceId = connection.source;
      const targetId = connection.target;

      if (!sourceId?.startsWith('letter-quiz-') || !targetId?.startsWith('target-quiz-')) {
        return false;
      }

      // Allow connection even if letter already has one (will be replaced)
      // Allow connection even if target already has one (will be replaced)
      return true;
    },
    [edges],
  );

  // Handle new connection
  const onConnect = useCallback(
    (connection: Connection) => {
      if (isChecked) return;

      // Remove existing connection from this letter (if any)
      // Also remove existing connection to this target (if any) - each target can only have one connection
      const newEdges = edges.filter(
        (e) => e.source !== connection.source && e.target !== connection.target,
      );

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
    // Total is based on actual connections, not total questions
    const totalConnections = edges.length;
    const letterResults: Map<string, 'correct' | 'incorrect'> = new Map();
    const targetResults: Map<string, 'correct' | 'incorrect'> = new Map();

    for (const question of questions) {
      const letterId = `letter-quiz-${question.letter.id}`;
      const connection = edges.find((e) => e.source === letterId);

      if (connection) {
        const targetIdNum = Number.parseInt(connection.target.replace('target-quiz-', ''), 10);
        const isCorrect = question.correctTargetIds.includes(targetIdNum);
        const status = isCorrect ? 'correct' : 'incorrect';

        letterResults.set(letterId, status);
        targetResults.set(connection.target, status);

        if (isCorrect) {
          correctCount++;
        }
      }
    }

    // Update node styles based on results
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.type === 'letterQuiz') {
          const status = letterResults.get(node.id) || 'none';
          return { ...node, data: { ...node.data, status } };
        }

        if (node.type === 'targetQuiz') {
          const status = targetResults.get(node.id) || 'none';
          return { ...node, data: { ...node.data, status } };
        }

        return node;
      }),
    );

    // Update edge styles
    setEdges((currentEdges) =>
      currentEdges.map((edge) => {
        const letterIdNum = Number.parseInt(edge.source.replace('letter-quiz-', ''), 10);
        const targetIdNum = Number.parseInt(edge.target.replace('target-quiz-', ''), 10);
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

    setScore({ correct: correctCount, total: totalConnections });
    setIsChecked(true);
  }, [questions, edges, setNodes, setEdges]);

  // Count current connections and targets
  const connectionCount = useMemo(() => edges.length, [edges]);
  const targetCount = useMemo(() => nodes.filter((n) => n.type === 'targetQuiz').length, [nodes]);

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
            // Mode selection
            <div className="flex flex-col gap-4 py-4">
              <Button
                onClick={() => startQuiz('makhraj')}
                variant="outline"
                className="h-20 text-lg"
              >
                <span className="text-2xl">🎯</span>
                {t('mode_makhraj')}
              </Button>
              <Button onClick={() => startQuiz('sifat')} variant="outline" className="h-20 text-lg">
                <span className="text-2xl">✨</span>
                {t('mode_sifat')}
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
                    {t('score', {
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
                <p className="text-center text-muted-foreground text-sm">{t('instruction')}</p>
              )}
            </div>
          )}

          {quizMode && (
            <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
              <Button variant="outline" onClick={resetQuiz}>
                <RefreshCwIcon className="mr-2 h-4 w-4" />
                {t('change_mode')}
              </Button>
              <div className="flex gap-2">
                {isChecked ? (
                  <Button onClick={() => generateQuiz(quizMode)} variant="default">
                    <RefreshCwIcon className="mr-2 h-4 w-4" />
                    {t('try_again')}
                  </Button>
                ) : (
                  <Button
                    onClick={checkAnswers}
                    disabled={connectionCount < Math.min(questions.length, targetCount)}
                    variant="default"
                  >
                    <CheckCircle2Icon className="mr-2 h-4 w-4" />
                    {t('check_answer')}
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
