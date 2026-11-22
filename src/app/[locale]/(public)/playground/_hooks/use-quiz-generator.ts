'use client';

import { useQuery } from '@tanstack/react-query';
import type { Connection, Edge, Node } from '@xyflow/react';
import type { Dispatch, SetStateAction } from 'react';

import { getPlaygroundDataOpt } from '@/features/tajweed-graph/queries/tajweed-graph';

import {
  applyResultsToEdges,
  applyResultsToNodes,
  calculateAnswer,
} from '../_lib/quiz-checker';
import {
  calculateRequiredConnection,
  handleQuizConnection,
} from '../_lib/quiz-connection';
import { generateQuizData } from '../_lib/quiz-generator';
import { useQuizStore } from '../_providers/quiz';
import type { QuizType } from '../_schemas/quiz';

interface UseQuizGeneratorProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
}

export type UseQuizGeneratorReturn = ReturnType<typeof useQuizGenerator>;

function isValidConnection(connection: Edge | Connection) {
  const sourceId = connection.source;
  const targetId = connection.target;
  const isLetterQuiz = sourceId.startsWith('letter-quiz-');
  const isTargetQuiz = targetId.startsWith('target-quiz-');

  return isLetterQuiz && isTargetQuiz;
}

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

  // Only use specific letter in practice mode
  const specificLetterId =
    mode === 'practice' ? practiceSettings.specificLetterId : null;

  // Fetch data
  const { data: playgroundData } = useQuery(getPlaygroundDataOpt());
  const letters = playgroundData?.letters ?? [];
  const letterArticulations = playgroundData?.letterArticulations ?? [];
  const letterTraits = playgroundData?.letterTraits ?? [];
  const articulationPoints = playgroundData?.articulationPoints ?? [];
  const traits = playgroundData?.traits ?? [];
  const traitGroups = playgroundData?.traitGroups ?? [];

  // Generate quiz questions and nodes
  function generateQuiz(
    type: QuizType,
    overrideSettings?: Partial<{
      lettersPerQuiz: number;
      targetsPerQuiz: number;
      multiEdge: boolean;
      specificLetterId: number | null;
    }>,
  ) {
    const result = generateQuizData(
      type,
      {
        letters,
        letterArticulations,
        letterTraits,
        articulationPoints,
        traits,
        traitGroups,
      },
      {
        lettersPerQuiz: overrideSettings?.lettersPerQuiz ?? lettersPerQuiz,
        targetsPerQuiz: overrideSettings?.targetsPerQuiz ?? targetsPerQuiz,
        multiEdge: overrideSettings?.multiEdge ?? multiEdge,
        specificLetterId:
          overrideSettings?.specificLetterId !== undefined
            ? overrideSettings.specificLetterId
            : specificLetterId,
      },
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
  const letterCount = nodes.filter((n) => n.type === 'letterQuiz').length;
  const targetCount = nodes.filter((n) => n.type === 'targetQuiz').length;

  const requiredConnection = calculateRequiredConnection(
    letterCount,
    targetCount,
    {
      lettersPerQuiz,
      targetsPerQuiz,
      multiEdge,
    },
  );

  // Check answer - returns the score and question analytics for caller to use
  function checkAnswer(questionNumber = 1) {
    setIsChecked(true);

    const { correctCount, letterResults, targetResults, questionAnalytics } =
      calculateAnswer(questions, edges, targets, questionNumber);

    setNodes((currentNodes) =>
      applyResultsToNodes(currentNodes, letterResults, targetResults),
    );
    setEdges((currentEdges) => applyResultsToEdges(currentEdges, questions));

    const score = { correct: correctCount, total: requiredConnection };

    return { score, questionAnalytics };
  }

  return {
    generateQuiz,
    checkAnswer,
    onConnect,
    requiredConnection,
    isValidConnection,
  };
}
