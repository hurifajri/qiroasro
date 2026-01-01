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

const LETTERS_PER_QUIZ: number = 1;
const TARGETS_PER_QUIZ: number = 3;
const MULTI_EDGE: boolean = false;

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
  const [isUnsupportedConfig, setIsUnsupportedConfig] = useState(false);
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

      // Shuffle letters
      const shuffledLetters = [...availableLetters].sort(() => Math.random() - 0.5);

      // Get target items
      let allTargets: TargetItem[];
      if (mode === 'makhraj') {
        allTargets = articulationPoints.map((ap) => ({ id: ap.id, slug: ap.slug }));
      } else {
        allTargets = traits
          .filter((t) => validTraitIds.has(t.id))
          .map((t) => ({ id: t.id, slug: t.slug }));
      }

      // Helper function to get correct target IDs for a letter
      const getCorrectTargetIds = (letter: Letter): number[] => {
        if (mode === 'makhraj') {
          return letterArticulations
            .filter((la) => la.letterId === letter.id)
            .map((la) => la.pointId);
        } else {
          return letterTraits
            .filter((lt) => lt.letterId === letter.id && validTraitIds.has(lt.traitId))
            .map((lt) => lt.traitId);
        }
      };

      let selectedLetters: Letter[] = [];
      let newQuestions: QuizQuestion[] = [];
      let selectedTargets: TargetItem[] = [];

      // Determine quiz case based on configuration
      const isCase1 = !MULTI_EDGE && LETTERS_PER_QUIZ === 1 && TARGETS_PER_QUIZ > 1;
      const isCase2 = MULTI_EDGE && LETTERS_PER_QUIZ === 1 && TARGETS_PER_QUIZ > 1;
      const isCase3 = !MULTI_EDGE && LETTERS_PER_QUIZ > 1 && TARGETS_PER_QUIZ === 1;
      const isCase4 = MULTI_EDGE && LETTERS_PER_QUIZ > 1 && TARGETS_PER_QUIZ === 1;
      const isSupportedConfig = isCase1 || isCase2 || isCase3 || isCase4;

      if (!isSupportedConfig) {
        // Case 5: Unsupported configuration
        setIsUnsupportedConfig(true);
        setQuestions([]);
        setTargets([]);
        setNodes([]);
        setEdges([]);
        return;
      }

      setIsUnsupportedConfig(false);

      if (isCase1) {
        // Case 1: !multiEdge && letter=1 && target>1
        // Letter can only connect to 1 target, rest are distractors
        const letter = shuffledLetters[0];
        const letterCorrectIds = getCorrectTargetIds(letter);

        // Pick one correct target randomly
        const shuffledCorrectIds = [...letterCorrectIds].sort(() => Math.random() - 0.5);
        const selectedTargetId = shuffledCorrectIds[0];

        selectedLetters = [letter];
        newQuestions = [{ letter, correctTargetIds: [selectedTargetId], targetType: mode }];

        // Get correct target and distractors
        const correctTarget = allTargets.find((t) => t.id === selectedTargetId);
        const distractorTargets = allTargets
          .filter((t) => !letterCorrectIds.includes(t.id))
          .sort(() => Math.random() - 0.5)
          .slice(0, TARGETS_PER_QUIZ - 1);

        selectedTargets = correctTarget
          ? [correctTarget, ...distractorTargets].sort(() => Math.random() - 0.5)
          : distractorTargets;
      } else if (isCase2) {
        // Case 2: multiEdge && letter=1 && target>1
        // Letter can connect to multiple targets, must have 1 distractor
        const letter = shuffledLetters[0];
        const letterCorrectIds = getCorrectTargetIds(letter);

        selectedLetters = [letter];
        // All letter's targets are correct
        newQuestions = [{ letter, correctTargetIds: letterCorrectIds, targetType: mode }];

        // Get correct targets (limit to TARGETS_PER_QUIZ - 1 to leave room for 1 distractor)
        const correctTargets = allTargets
          .filter((t) => letterCorrectIds.includes(t.id))
          .sort(() => Math.random() - 0.5)
          .slice(0, TARGETS_PER_QUIZ - 1);

        // Get 1 distractor (target that letter doesn't have)
        const distractorTarget = allTargets
          .filter((t) => !letterCorrectIds.includes(t.id))
          .sort(() => Math.random() - 0.5)[0];

        selectedTargets = distractorTarget
          ? [...correctTargets, distractorTarget].sort(() => Math.random() - 0.5)
          : correctTargets;
      } else if (isCase3) {
        // Case 3: !multiEdge && letter>1 && target=1
        // Target can only connect to 1 letter, rest are distractors
        const firstLetter = shuffledLetters[0];
        const firstLetterCorrectIds = getCorrectTargetIds(firstLetter);

        // Pick one correct target randomly
        const shuffledCorrectIds = [...firstLetterCorrectIds].sort(() => Math.random() - 0.5);
        const selectedTargetId = shuffledCorrectIds[0];

        // Find distractor letters that don't have this target
        const distractorLetters = shuffledLetters.slice(1).filter((letter) => {
          const letterTargetIds = getCorrectTargetIds(letter);
          return !letterTargetIds.includes(selectedTargetId);
        });

        selectedLetters = [firstLetter, ...distractorLetters.slice(0, LETTERS_PER_QUIZ - 1)];

        // First letter is correct, others are distractors
        newQuestions = selectedLetters.map((letter, index) => ({
          letter,
          correctTargetIds: index === 0 ? [selectedTargetId] : [],
          targetType: mode,
        }));

        // Only one target
        selectedTargets = allTargets.filter((t) => t.id === selectedTargetId);
      } else if (isCase4) {
        // Case 4: multiEdge && letter>1 && target=1
        // Target can connect to multiple letters, must have 1 distractor letter
        const shuffledTargets = [...allTargets].sort(() => Math.random() - 0.5);
        const targetItem = shuffledTargets[0];

        // Find letters that have this target
        const lettersWithTarget = shuffledLetters.filter((letter) => {
          const letterTargetIds = getCorrectTargetIds(letter);
          return letterTargetIds.includes(targetItem.id);
        });

        // Find 1 distractor letter that doesn't have this target
        const distractorLetter = shuffledLetters.find((letter) => {
          const letterTargetIds = getCorrectTargetIds(letter);
          return !letterTargetIds.includes(targetItem.id);
        });

        // Take correct letters (limit to LETTERS_PER_QUIZ - 1 for distractor)
        const correctLetters = lettersWithTarget.slice(0, LETTERS_PER_QUIZ - 1);
        selectedLetters = distractorLetter
          ? [...correctLetters, distractorLetter].sort(() => Math.random() - 0.5)
          : correctLetters;

        // Create questions - letters that have the target are correct
        newQuestions = selectedLetters.map((letter) => {
          const letterTargetIds = getCorrectTargetIds(letter);
          const isCorrect = letterTargetIds.includes(targetItem.id);
          return {
            letter,
            correctTargetIds: isCorrect ? [targetItem.id] : [],
            targetType: mode,
          };
        });

        selectedTargets = [targetItem];
      }

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
  const isValidConnection = useCallback((connection: Edge | Connection) => {
    // Only allow connections from letters to targets
    const sourceId = connection.source;
    const targetId = connection.target;

    if (!sourceId?.startsWith('letter-quiz-') || !targetId?.startsWith('target-quiz-')) {
      return false;
    }

    // Allow connection even if letter already has one (will be replaced)
    // Allow connection even if target already has one (will be replaced)
    return true;
  }, []);

  // Handle new connection
  const onConnect = useCallback(
    (connection: Connection) => {
      if (isChecked) return;
      if (!connection.source || !connection.target) return;

      let newEdges: Edge[];

      if (MULTI_EDGE) {
        // Multi-edge mode: allow multiple connections
        // Case 2: multiple edges from same letter to different targets
        // Case 4: multiple edges from different letters to same target

        // Case 2: Check if connection to this target already exists (same letter can't connect to same target twice)
        if (LETTERS_PER_QUIZ === 1 && TARGETS_PER_QUIZ > 1) {
          const connectionExists = edges.some((e) => e.target === connection.target);
          if (connectionExists) return; // Don't allow duplicate connections to same target

          const targetNodes = nodes.filter((n) => n.type === 'targetQuiz');
          const maxEdges = targetNodes.length - 1;
          if (edges.length >= maxEdges) return; // Don't allow more edges
        }

        // Case 4: Check if connection from this letter already exists (same letter can't connect twice)
        if (LETTERS_PER_QUIZ > 1 && TARGETS_PER_QUIZ === 1) {
          const connectionExists = edges.some((e) => e.source === connection.source);
          if (connectionExists) return; // Don't allow duplicate connections from same letter

          const letterNodes = nodes.filter((n) => n.type === 'letterQuiz');
          const maxEdges = letterNodes.length - 1;
          if (edges.length >= maxEdges) return; // Don't allow more edges
        }

        newEdges = edges;
      } else {
        // Single-edge mode: replace existing connections
        // Case 1: letter can only connect to 1 target (remove letter's existing edge)
        // Case 3: target can only connect to 1 letter (remove target's existing edge)
        if (LETTERS_PER_QUIZ === 1 && TARGETS_PER_QUIZ > 1) {
          // Case 1: Remove existing connection from this letter
          newEdges = edges.filter((e) => e.source !== connection.source);
        } else if (LETTERS_PER_QUIZ > 1 && TARGETS_PER_QUIZ === 1) {
          // Case 3: Remove existing connection to this target
          newEdges = edges.filter((e) => e.target !== connection.target);
        } else {
          // Default: remove both
          newEdges = edges.filter(
            (e) => e.source !== connection.source && e.target !== connection.target,
          );
        }
      }

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
    [edges, isChecked, setEdges, nodes],
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
    const letterResults: Map<string, 'correct' | 'incorrect'> = new Map();
    const targetResults: Map<string, 'correct' | 'incorrect'> = new Map();

    for (const question of questions) {
      const letterId = `letter-quiz-${question.letter.id}`;
      // Find all connections for this letter (for multiEdge mode)
      const letterConnections = edges.filter((e) => e.source === letterId);

      for (const connection of letterConnections) {
        const targetIdNum = Number.parseInt(connection.target.replace('target-quiz-', ''), 10);
        const isCorrect = question.correctTargetIds.includes(targetIdNum);
        const status = isCorrect ? 'correct' : 'incorrect';

        // For letter status, use the result of this connection
        // In multiEdge mode, letter could have multiple connections
        const currentLetterStatus = letterResults.get(letterId);
        if (!currentLetterStatus || (isCorrect && currentLetterStatus === 'incorrect')) {
          letterResults.set(letterId, status);
        }
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

    setScore({ correct: correctCount, total: edges.length });
    setIsChecked(true);
  }, [questions, edges, setNodes, setEdges]);

  // Count current connections and targets
  const connectionCount = useMemo(() => edges.length, [edges]);
  const letterCount = useMemo(() => nodes.filter((n) => n.type === 'letterQuiz').length, [nodes]);
  const targetCount = useMemo(() => nodes.filter((n) => n.type === 'targetQuiz').length, [nodes]);

  // Calculate required connections based on quiz case
  const requiredConnections = useMemo(() => {
    if (MULTI_EDGE) {
      // Case 2: all correct targets (targetCount - 1 distractors = targetCount - 1 correct)
      // Case 4: all correct letters (letterCount - 1 distractors = letterCount - 1 correct)
      if (LETTERS_PER_QUIZ === 1) return targetCount - 1; // Case 2
      if (TARGETS_PER_QUIZ === 1) return letterCount - 1; // Case 4
    }
    // Cases 1 and 3: only 1 connection needed
    return 1;
  }, [letterCount, targetCount]);

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
          ) : isUnsupportedConfig ? (
            // Unsupported configuration message
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <XCircleIcon className="h-16 w-16 text-muted-foreground" />
              <p className="text-center text-muted-foreground">
                Quiz belum tersedia untuk pilihan ini.
              </p>
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

          {quizMode && !isUnsupportedConfig && (
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
                    disabled={connectionCount < requiredConnections}
                    variant="default"
                  >
                    <CheckCircle2Icon className="mr-2 h-4 w-4" />
                    {t('check_answer')}
                  </Button>
                )}
              </div>
            </DialogFooter>
          )}

          {quizMode && isUnsupportedConfig && (
            <DialogFooter className="flex-row justify-center">
              <Button variant="outline" onClick={resetQuiz}>
                <RefreshCwIcon className="mr-2 h-4 w-4" />
                {t('change_mode')}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
