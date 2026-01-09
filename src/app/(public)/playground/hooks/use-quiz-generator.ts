'use client';

import { useQuery } from '@tanstack/react-query';
import type { Connection, Edge, Node } from '@xyflow/react';
import { useCallback } from 'react';
import { applyResultsToEdges, applyResultsToNodes, checkQuizAnswers } from '../lib/quiz-checker';
import {
  calculateRequiredConnections,
  handleQuizConnection,
  isValidQuizConnection,
} from '../lib/quiz-connection';
import { generateQuizData } from '../lib/quiz-generator';
import { useQuizStore } from '../providers/quiz';
import { getPlaygroundDataOpt } from '../queries/playground';
import type { QuizMode } from '../schemas/quiz';

interface UseQuizGeneratorProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export type UseQuizGeneratorReturn = ReturnType<typeof useQuizGenerator>;

export function useQuizGenerator({ nodes, edges, setNodes, setEdges }: UseQuizGeneratorProps) {
  // Get settings and state from store
  const practiceSettings = useQuizStore((s) => s.practiceSettings);
  const questions = useQuizStore((s) => s.questions);
  const targets = useQuizStore((s) => s.targets);
  const isChecked = useQuizStore((s) => s.isChecked);

  // Get store actions
  const setQuestions = useQuizStore((s) => s.setQuestions);
  const setTargets = useQuizStore((s) => s.setTargets);
  const setIsChecked = useQuizStore((s) => s.setIsChecked);
  const setPracticeScore = useQuizStore((s) => s.setPracticeScore);

  const { lettersPerQuiz, targetsPerQuiz, multiEdge } = practiceSettings;

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
      const result = generateQuizData(
        mode,
        { letters, letterArticulations, letterTraits, articulationPoints, traits },
        { lettersPerQuiz, targetsPerQuiz, multiEdge },
      );

      if (result.isUnsupported) {
        setQuestions([]);
        setTargets([]);
        setNodes([]);
        setEdges([]);
        return;
      }

      setQuestions(result.questions);
      setTargets(result.targets);
      setNodes(result.nodes);
      setEdges(result.edges);
      setIsChecked(false);
      setPracticeScore({ correct: 0, total: 0 });
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
      setIsChecked,
      setPracticeScore,
    ],
  );

  // Validate connection
  const isValidConnection = useCallback(
    (connection: Edge | Connection) => isValidQuizConnection(connection),
    [],
  );

  // Handle new connection
  const onConnect = useCallback(
    (connection: Connection) => {
      if (isChecked) return;

      const newEdges = handleQuizConnection(connection, edges, nodes, {
        lettersPerQuiz,
        targetsPerQuiz,
        multiEdge,
      });

      if (newEdges) {
        setEdges(newEdges);
      }
    },
    [edges, isChecked, setEdges, nodes, lettersPerQuiz, targetsPerQuiz, multiEdge],
  );

  // Derived state
  const connectionCount = edges.length;
  const letterCount = nodes.filter((n) => n.type === 'letterQuiz').length;
  const targetCount = nodes.filter((n) => n.type === 'targetQuiz').length;

  const requiredConnections = calculateRequiredConnections(letterCount, targetCount, {
    lettersPerQuiz,
    targetsPerQuiz,
    multiEdge,
  });

  // Check answers - returns the score and incorrect items for caller to use
  const checkAnswers = useCallback(() => {
    const { correctCount, letterResults, targetResults, incorrectItem } = checkQuizAnswers(
      questions,
      edges,
      targets,
    );

    setNodes((currentNodes) => applyResultsToNodes(currentNodes, letterResults, targetResults));
    setEdges((currentEdges) => applyResultsToEdges(currentEdges, questions));

    const newScore = { correct: correctCount, total: requiredConnections };
    setPracticeScore(newScore);
    setIsChecked(true);

    return { score: newScore, incorrectItem };
  }, [
    questions,
    edges,
    targets,
    setNodes,
    setEdges,
    setPracticeScore,
    setIsChecked,
    requiredConnections,
  ]);

  return {
    generateQuiz,
    isValidConnection,
    onConnect,
    checkAnswers,
    connectionCount,
    requiredConnections,
  };
}
