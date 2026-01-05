import type { Edge, Node } from '@xyflow/react';
import type { QuizQuestion, QuizTarget } from '../schemas/quiz';

export interface IncorrectItem {
  name: string;
  type: 'letter' | 'articulation_point' | 'trait';
  errorType: 'incorrect' | 'missed';
}

interface CheckAnswersResult {
  correctCount: number;
  letterResults: Map<string, 'correct' | 'incorrect'>;
  targetResults: Map<string, 'correct' | 'incorrect'>;
  incorrectItem: IncorrectItem[];
}

/**
 * Pure function to check quiz answers and determine results.
 * @param questions - Quiz questions with letters and their correct target IDs
 * @param edges - User's connections/answers
 * @param displayedTargets - Targets that are actually displayed on screen (for filtering)
 */
export function checkQuizAnswers(
  questions: QuizQuestion[],
  edges: Edge[],
  displayedTargets: QuizTarget[],
): CheckAnswersResult {
  let correctCount = 0;
  const letterResults: Map<string, 'correct' | 'incorrect'> = new Map();
  const targetResults: Map<string, 'correct' | 'incorrect'> = new Map();
  const incorrectItem: IncorrectItem[] = [];

  // Get set of displayed target IDs for fast lookup
  const displayedTargetIds = new Set(displayedTargets.map((t) => t.id));

  for (const question of questions) {
    const letterId = `letter-quiz-${question.letter.id}`;
    const letterConnections = edges.filter((e) => e.source === letterId);

    // Filter correctTargetIds to only include targets that are displayed on screen
    const validCorrectTargetIds = question.correctTargetIds.filter((id) =>
      displayedTargetIds.has(id),
    );

    for (const connection of letterConnections) {
      const targetIdNum = Number.parseInt(connection.target.replace('target-quiz-', ''), 10);
      const isCorrect = validCorrectTargetIds.includes(targetIdNum);
      const status = isCorrect ? 'correct' : 'incorrect';

      const currentLetterStatus = letterResults.get(letterId);
      if (!currentLetterStatus || (isCorrect && currentLetterStatus === 'incorrect')) {
        letterResults.set(letterId, status);
      }
      targetResults.set(connection.target, status);

      if (isCorrect) {
        correctCount++;
      } else {
        // Track incorrect connection - letter connected to wrong target
        incorrectItem.push({
          name: question.letter.symbol,
          type: 'letter',
          errorType: 'incorrect',
        });
      }
    }

    // Check for missed correct connections (unanswered) - only for displayed targets
    const answeredTargets = letterConnections.map((c) =>
      Number.parseInt(c.target.replace('target-quiz-', ''), 10),
    );
    for (const correctId of validCorrectTargetIds) {
      if (!answeredTargets.includes(correctId)) {
        // Track missed connection - should have been connected but wasn't
        incorrectItem.push({
          name: question.letter.symbol,
          type: 'letter',
          errorType: 'missed',
        });
      }
    }
  }

  return { correctCount, letterResults, targetResults, incorrectItem };
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
