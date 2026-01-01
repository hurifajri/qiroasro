'use client';

import { useQuery } from '@tanstack/react-query';
import { addEdge, type Connection, type Edge, type Node } from '@xyflow/react';
import { useCallback, useMemo } from 'react';
import type { Letter } from '@/schemas/letter';
import { createLetterQuizNode, createTargetQuizNode } from '../lib/node';
import { getPlaygroundDataOpt } from '../queries/playground';
import type { LetterQuiz } from '../schemas/letter';
import type { TargetQuizNodeData } from '../schemas/node';
import type { QuizMode, QuizQuestion, QuizScoreCount, TargetItem } from '../schemas/quiz';

interface UseQuizGeneratorProps {
  lettersPerQuiz: number;
  targetsPerQuiz: number;
  multiEdge: boolean;
  nodes: Node[];
  edges: Edge[];
  questions: QuizQuestion[];
  isChecked: boolean;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setQuestions: React.Dispatch<React.SetStateAction<QuizQuestion[]>>;
  setTargets: React.Dispatch<React.SetStateAction<TargetItem[]>>;
  setIsUnsupportedConfig: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setScore: React.Dispatch<React.SetStateAction<QuizScoreCount>>;
}

export function useQuizGenerator({
  lettersPerQuiz,
  targetsPerQuiz,
  multiEdge,
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
}: UseQuizGeneratorProps) {
  // Fetch data
  const { data: playgroundData } = useQuery(getPlaygroundDataOpt());
  const letters = playgroundData?.letters ?? [];
  const letterArticulations = playgroundData?.letterArticulations ?? [];
  const letterTraits = playgroundData?.letterTraits ?? [];
  const articulationPoints = playgroundData?.articulationPoints ?? [];
  const traits = playgroundData?.traits ?? [];

  // Generate quiz questions and nodes
  const generateQuiz = useCallback(
    (mode: QuizMode) => {
      const validTraitIds = new Set(traits.filter((t) => t.groupId !== 7).map((t) => t.id));
      const availableLetters = letters.filter((letter) => {
        if (mode === 'articulation_point') {
          return letterArticulations.some((la) => la.letterId === letter.id);
        }
        return letterTraits.some(
          (lt) => lt.letterId === letter.id && validTraitIds.has(lt.traitId),
        );
      });

      const shuffledLetters = [...availableLetters].sort(() => Math.random() - 0.5);

      let allTargets: TargetItem[];
      if (mode === 'articulation_point') {
        allTargets = articulationPoints.map((ap) => ({ id: ap.id, slug: ap.slug }));
      } else {
        allTargets = traits
          .filter((t) => validTraitIds.has(t.id))
          .map((t) => ({ id: t.id, slug: t.slug }));
      }

      const getCorrectTargetIds = (letter: Letter): number[] => {
        if (mode === 'articulation_point') {
          return letterArticulations
            .filter((la) => la.letterId === letter.id)
            .map((la) => la.pointId);
        }
        return letterTraits
          .filter((lt) => lt.letterId === letter.id && validTraitIds.has(lt.traitId))
          .map((lt) => lt.traitId);
      };

      let selectedLetters: Letter[] = [];
      let newQuestions: QuizQuestion[] = [];
      let selectedTargets: TargetItem[] = [];

      // Determine quiz case
      const isCase1 = !multiEdge && lettersPerQuiz === 1 && targetsPerQuiz > 1;
      const isCase2 = multiEdge && lettersPerQuiz === 1 && targetsPerQuiz > 1;
      const isCase3 = !multiEdge && lettersPerQuiz > 1 && targetsPerQuiz === 1;
      const isCase4 = multiEdge && lettersPerQuiz > 1 && targetsPerQuiz === 1;
      const isSupportedConfig = isCase1 || isCase2 || isCase3 || isCase4;

      if (!isSupportedConfig) {
        setIsUnsupportedConfig(true);
        setQuestions([]);
        setTargets([]);
        setNodes([]);
        setEdges([]);
        return;
      }

      setIsUnsupportedConfig(false);

      if (isCase1) {
        const letter = shuffledLetters[0];
        const letterCorrectIds = getCorrectTargetIds(letter);
        const shuffledCorrectIds = [...letterCorrectIds].sort(() => Math.random() - 0.5);
        const selectedTargetId = shuffledCorrectIds[0];

        selectedLetters = [letter];
        newQuestions = [{ letter, correctTargetIds: [selectedTargetId], targetType: mode }];

        const correctTarget = allTargets.find((t) => t.id === selectedTargetId);
        const distractorTargets = allTargets
          .filter((t) => !letterCorrectIds.includes(t.id))
          .sort(() => Math.random() - 0.5)
          .slice(0, targetsPerQuiz - 1);

        selectedTargets = correctTarget
          ? [correctTarget, ...distractorTargets].sort(() => Math.random() - 0.5)
          : distractorTargets;
      } else if (isCase2) {
        const letter = shuffledLetters[0];
        const letterCorrectIds = getCorrectTargetIds(letter);

        selectedLetters = [letter];
        newQuestions = [{ letter, correctTargetIds: letterCorrectIds, targetType: mode }];

        const correctTargets = allTargets
          .filter((t) => letterCorrectIds.includes(t.id))
          .sort(() => Math.random() - 0.5)
          .slice(0, targetsPerQuiz - 1);

        const distractorTarget = allTargets
          .filter((t) => !letterCorrectIds.includes(t.id))
          .sort(() => Math.random() - 0.5)[0];

        selectedTargets = distractorTarget
          ? [...correctTargets, distractorTarget].sort(() => Math.random() - 0.5)
          : correctTargets;
      } else if (isCase3) {
        const firstLetter = shuffledLetters[0];
        const firstLetterCorrectIds = getCorrectTargetIds(firstLetter);
        const shuffledCorrectIds = [...firstLetterCorrectIds].sort(() => Math.random() - 0.5);
        const selectedTargetId = shuffledCorrectIds[0];

        const distractorLetters = shuffledLetters.slice(1).filter((letter) => {
          const letterTargetIds = getCorrectTargetIds(letter);
          return !letterTargetIds.includes(selectedTargetId);
        });

        selectedLetters = [firstLetter, ...distractorLetters.slice(0, lettersPerQuiz - 1)];
        newQuestions = selectedLetters
          .map((letter, index) => ({
            letter,
            correctTargetIds: index === 0 ? [selectedTargetId] : [],
            targetType: mode,
          }))
          .sort(() => Math.random() - 0.5); // Shuffle to randomize position
        selectedTargets = allTargets.filter((t) => t.id === selectedTargetId);
      } else if (isCase4) {
        const shuffledTargets = [...allTargets].sort(() => Math.random() - 0.5);
        const targetItem = shuffledTargets[0];

        const lettersWithTarget = shuffledLetters.filter((letter) => {
          const letterTargetIds = getCorrectTargetIds(letter);
          return letterTargetIds.includes(targetItem.id);
        });

        const distractorLetter = shuffledLetters.find((letter) => {
          const letterTargetIds = getCorrectTargetIds(letter);
          return !letterTargetIds.includes(targetItem.id);
        });

        const correctLetters = lettersWithTarget.slice(0, lettersPerQuiz - 1);
        selectedLetters = distractorLetter
          ? [...correctLetters, distractorLetter].sort(() => Math.random() - 0.5)
          : correctLetters;

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

      const letterNodes: Node[] = newQuestions.map((q, index) => {
        const letter: LetterQuiz = { ...q.letter, status: 'none' };
        const position = { x: 50, y: 30 + index * 70 };
        return createLetterQuizNode(letter, position);
      });

      const targetNodes: Node[] = selectedTargets.map((q, index) => {
        const target: TargetQuizNodeData = { id: q.id, slug: q.slug, mode, status: 'none' };
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
    [
      letters,
      letterArticulations,
      letterTraits,
      articulationPoints,
      traits,
      lettersPerQuiz,
      targetsPerQuiz,
      multiEdge,
      setNodes,
      setEdges,
      setQuestions,
      setTargets,
      setIsUnsupportedConfig,
      setIsChecked,
      setScore,
    ],
  );

  // Validate connection
  const isValidConnection = useCallback((connection: Edge | Connection) => {
    const sourceId = connection.source;
    const targetId = connection.target;
    return sourceId?.startsWith('letter-quiz-') && targetId?.startsWith('target-quiz-');
  }, []);

  // Handle new connection
  const onConnect = useCallback(
    (connection: Connection) => {
      if (isChecked) return;
      if (!connection.source || !connection.target) return;

      let newEdges: Edge[];

      if (multiEdge) {
        if (lettersPerQuiz === 1 && targetsPerQuiz > 1) {
          const connectionExists = edges.some((e) => e.target === connection.target);
          if (connectionExists) return;
          const targetNodes = nodes.filter((n) => n.type === 'targetQuiz');
          const maxEdges = targetNodes.length - 1;
          if (edges.length >= maxEdges) return;
        }

        if (lettersPerQuiz > 1 && targetsPerQuiz === 1) {
          const connectionExists = edges.some((e) => e.source === connection.source);
          if (connectionExists) return;
          const letterNodes = nodes.filter((n) => n.type === 'letterQuiz');
          const maxEdges = letterNodes.length - 1;
          if (edges.length >= maxEdges) return;
        }

        newEdges = edges;
      } else {
        if (lettersPerQuiz === 1 && targetsPerQuiz > 1) {
          newEdges = edges.filter((e) => e.source !== connection.source);
        } else if (lettersPerQuiz > 1 && targetsPerQuiz === 1) {
          newEdges = edges.filter((e) => e.target !== connection.target);
        } else {
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
    [edges, isChecked, setEdges, nodes, lettersPerQuiz, targetsPerQuiz, multiEdge],
  );

  // Derived state - moved before checkAnswers so it can be used there
  const connectionCount = useMemo(() => edges.length, [edges]);
  const letterCount = useMemo(() => nodes.filter((n) => n.type === 'letterQuiz').length, [nodes]);
  const targetCount = useMemo(() => nodes.filter((n) => n.type === 'targetQuiz').length, [nodes]);

  const requiredConnections = useMemo(() => {
    if (multiEdge) {
      if (lettersPerQuiz === 1) return targetCount - 1;
      if (targetsPerQuiz === 1) return letterCount - 1;
    }
    return 1;
  }, [letterCount, targetCount, multiEdge, lettersPerQuiz, targetsPerQuiz]);

  // Check answers
  const checkAnswers = useCallback(() => {
    let correctCount = 0;
    const letterResults: Map<string, 'correct' | 'incorrect'> = new Map();
    const targetResults: Map<string, 'correct' | 'incorrect'> = new Map();

    for (const question of questions) {
      const letterId = `letter-quiz-${question.letter.id}`;
      const letterConnections = edges.filter((e) => e.source === letterId);

      for (const connection of letterConnections) {
        const targetIdNum = Number.parseInt(connection.target.replace('target-quiz-', ''), 10);
        const isCorrect = question.correctTargetIds.includes(targetIdNum);
        const status = isCorrect ? 'correct' : 'incorrect';

        const currentLetterStatus = letterResults.get(letterId);
        if (!currentLetterStatus || (isCorrect && currentLetterStatus === 'incorrect')) {
          letterResults.set(letterId, status);
        }
        targetResults.set(connection.target, status);

        if (isCorrect) correctCount++;
      }
    }

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

    setEdges((currentEdges) =>
      currentEdges.map((edge) => {
        const letterIdNum = Number.parseInt(edge.source.replace('letter-quiz-', ''), 10);
        const targetIdNum = Number.parseInt(edge.target.replace('target-quiz-', ''), 10);
        const question = questions.find((q) => q.letter.id === letterIdNum);
        const isCorrect = question?.correctTargetIds.includes(targetIdNum) || false;

        return {
          ...edge,
          style: { stroke: isCorrect ? '#22c55e' : '#ef4444', strokeWidth: 3 },
          animated: false,
        };
      }),
    );

    // Use requiredConnections as total, so missing connections count as wrong
    setScore({ correct: correctCount, total: requiredConnections });
    setIsChecked(true);
  }, [questions, edges, setNodes, setEdges, setScore, setIsChecked, requiredConnections]);

  return {
    generateQuiz,
    isValidConnection,
    onConnect,
    checkAnswers,
    connectionCount,
    requiredConnections,
  };
}
