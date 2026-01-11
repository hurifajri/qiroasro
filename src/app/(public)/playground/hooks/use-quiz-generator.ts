'use client';

import { useQuery } from '@tanstack/react-query';
import type { Connection, Edge, Node } from '@xyflow/react';
import {
  applyResultsToEdges,
  applyResultsToNodes,
  checkQuizAnswers,
} from '../lib/quiz-checker';
import {
  calculateRequiredConnections,
  handleQuizConnection,
  isValidQuizConnection,
} from '../lib/quiz-connection';
import { generateQuizData } from '../lib/quiz-generator';
import { useQuizStore } from '../providers/quiz';
import { getPlaygroundDataOpt } from '../queries/playground';
import type { QuizType } from '../schemas/quiz';

interface UseQuizGeneratorProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export type UseQuizGeneratorReturn = ReturnType<typeof useQuizGenerator>;

export function useQuizGenerator({
  nodes,
  edges,
  setNodes,
  setEdges,
}: UseQuizGeneratorProps) {
  // Get settings and state from store
  const practiceSettings = useQuizStore((s) => s.practiceSettings);
  const questions = useQuizStore((s) => s.questions);
  const targets = useQuizStore((s) => s.targets);
  const isChecked = useQuizStore((s) => s.isChecked);
  const mode = useQuizStore((s) => s.mode);
  const challengeCurrQuestion = useQuizStore((s) => s.challengeCurrQuestion);

  // Get store actions
  const setQuestions = useQuizStore((s) => s.setQuestions);
  const setTargets = useQuizStore((s) => s.setTargets);
  const setIsChecked = useQuizStore((s) => s.setIsChecked);
  const setPracticeScore = useQuizStore((s) => s.setPracticeScore);

  // Derive quiz config based on mode
  const lettersPerQuiz =
    mode === 'challenge' && challengeCurrQuestion
      ? challengeCurrQuestion.lettersPerQuiz
      : practiceSettings.lettersPerQuiz;
  const targetsPerQuiz =
    mode === 'challenge' && challengeCurrQuestion
      ? challengeCurrQuestion.targetsPerQuiz
      : practiceSettings.targetsPerQuiz;
  const multiEdge =
    mode === 'challenge' && challengeCurrQuestion
      ? challengeCurrQuestion.allowMultiEdge
      : practiceSettings.multiEdge;

  // Fetch data
  const { data: playgroundData } = useQuery(getPlaygroundDataOpt());
  const letters = playgroundData?.letters ?? [];
  const letterArticulations = playgroundData?.letterArticulations ?? [];
  const letterTraits = playgroundData?.letterTraits ?? [];
  const articulationPoints = playgroundData?.articulationPoints ?? [];
  const traits = playgroundData?.traits ?? [];

  // Generate quiz questions and nodes
  function generateQuiz(type: QuizType) {
    const result = generateQuizData(
      type,
      {
        letters,
        letterArticulations,
        letterTraits,
        articulationPoints,
        traits,
      },
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
  }

  // Validate connection
  function isValidConnection(connection: Edge | Connection) {
    return isValidQuizConnection(connection);
  }

  // Handle new connection
  function onConnect(connection: Connection) {
    if (isChecked) return;

    const newEdges = handleQuizConnection(connection, edges, nodes, {
      lettersPerQuiz,
      targetsPerQuiz,
      multiEdge,
    });

    if (newEdges) {
      setEdges(newEdges);
    }
  }

  // Derived state
  const connectionCount = edges.length;
  const letterCount = nodes.filter((n) => n.type === 'letterQuiz').length;
  const targetCount = nodes.filter((n) => n.type === 'targetQuiz').length;

  const requiredConnections = calculateRequiredConnections(
    letterCount,
    targetCount,
    {
      lettersPerQuiz,
      targetsPerQuiz,
      multiEdge,
    },
  );

  // Check answers - returns the score and incorrect items for caller to use
  function checkAnswers() {
    const { correctCount, letterResults, targetResults, incorrectItem } =
      checkQuizAnswers(questions, edges, targets);

    setNodes((currentNodes) =>
      applyResultsToNodes(currentNodes, letterResults, targetResults),
    );
    setEdges((currentEdges) => applyResultsToEdges(currentEdges, questions));

    const newScore = { correct: correctCount, total: requiredConnections };
    setPracticeScore(newScore);
    setIsChecked(true);

    return { score: newScore, incorrectItem };
  }

  return {
    generateQuiz,
    isValidConnection,
    onConnect,
    checkAnswers,
    connectionCount,
    requiredConnections,
  };
}
