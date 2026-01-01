import type { Edge, Node } from '@xyflow/react';
import type { QuizQuestion } from '../schemas/quiz';

interface CheckAnswersResult {
  correctCount: number;
  letterResults: Map<string, 'correct' | 'incorrect'>;
  targetResults: Map<string, 'correct' | 'incorrect'>;
}

/**
 * Pure function to check quiz answers and determine results.
 */
export function checkQuizAnswers(questions: QuizQuestion[], edges: Edge[]): CheckAnswersResult {
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

  return { correctCount, letterResults, targetResults };
}

/**
 * Apply answer results to nodes - returns updated nodes array.
 */
export function applyResultsToNodes(
  nodes: Node[],
  letterResults: Map<string, 'correct' | 'incorrect'>,
  targetResults: Map<string, 'correct' | 'incorrect'>,
): Node[] {
  return nodes.map((node) => {
    if (node.type === 'letterQuiz') {
      const status = letterResults.get(node.id) || 'none';
      return { ...node, data: { ...node.data, status } };
    }
    if (node.type === 'targetQuiz') {
      const status = targetResults.get(node.id) || 'none';
      return { ...node, data: { ...node.data, status } };
    }
    return node;
  });
}

/**
 * Apply answer results to edges - returns updated edges array.
 */
export function applyResultsToEdges(edges: Edge[], questions: QuizQuestion[]): Edge[] {
  return edges.map((edge) => {
    const letterIdNum = Number.parseInt(edge.source.replace('letter-quiz-', ''), 10);
    const targetIdNum = Number.parseInt(edge.target.replace('target-quiz-', ''), 10);
    const question = questions.find((q) => q.letter.id === letterIdNum);
    const isCorrect = question?.correctTargetIds.includes(targetIdNum) || false;

    return {
      ...edge,
      style: { stroke: isCorrect ? '#22c55e' : '#ef4444', strokeWidth: 3 },
      animated: false,
    };
  });
}
