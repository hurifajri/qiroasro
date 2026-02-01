import type { Edge, Node } from '@xyflow/react';
import type {
  ChallengeQuizAnalytic,
  QuizQuestion,
  QuizTarget,
} from '../schemas/quiz';

interface CalculateAnswerResult {
  correctCount: number;
  letterResults: Map<string, 'correct' | 'incorrect'>;
  targetResults: Map<string, 'correct' | 'incorrect'>;
  questionAnalytics: ChallengeQuizAnalytic[];
}

/**
 * Pure function to check quiz answers and determine results.
 * @param questions - Quiz questions with letters and their correct target IDs
 * @param edges - User's connections/answers
 * @param displayedTargets - Targets that are actually displayed on screen (for filtering)
 * @param questionNumber - Current question number (1-indexed)
 */
export function calculateAnswer(
  questions: QuizQuestion[],
  edges: Edge[],
  displayedTargets: QuizTarget[],
  questionNumber: number = 1,
): CalculateAnswerResult {
  let correctCount = 0;
  const letterResults: Map<string, 'correct' | 'incorrect'> = new Map();
  const targetResults: Map<string, 'correct' | 'incorrect'> = new Map();

  // Collect data for single analytic
  const allLetters: Array<{ id: number; symbol: string; isMadd: boolean }> = [];
  const allCorrectTargets: QuizTarget[] = [];
  const allUserAnswers: QuizTarget[] = [];
  const targetType = questions[0]?.targetType || 'articulation_point';

  // Get set of displayed target IDs for fast lookup
  const displayedTargetIds = new Set(displayedTargets.map((t) => t.id));

  for (const question of questions) {
    const letterId = `letter-quiz-${question.letter.id}`;
    const letterConnections = edges.filter((e) => e.source === letterId);

    // Collect letter
    allLetters.push({
      id: question.letter.id,
      symbol: question.letter.symbol,
      isMadd: question.letter.isMadd,
    });

    // Filter correctTargetIds to only include targets that are displayed on screen
    const validCorrectTargetIds = question.correctTargetIds.filter((id) =>
      displayedTargetIds.has(id),
    );

    // Get correct targets for this letter
    const correctTargets = displayedTargets.filter((t) =>
      validCorrectTargetIds.includes(t.id),
    );
    allCorrectTargets.push(...correctTargets);

    // Get user's answers from edges for this letter
    const userAnswerIds = letterConnections.map((c) =>
      Number.parseInt(c.target.replace('target-quiz-', ''), 10),
    );
    const userAnswers = displayedTargets.filter((t) =>
      userAnswerIds.includes(t.id),
    );
    allUserAnswers.push(...userAnswers);

    // Track connections for scoring
    for (const connection of letterConnections) {
      const targetIdNum = Number.parseInt(
        connection.target.replace('target-quiz-', ''),
        10,
      );
      const isCorrect = validCorrectTargetIds.includes(targetIdNum);
      const status = isCorrect ? 'correct' : 'incorrect';

      const currentLetterStatus = letterResults.get(letterId);
      if (
        !currentLetterStatus ||
        (isCorrect && currentLetterStatus === 'incorrect')
      ) {
        letterResults.set(letterId, status);
      }
      targetResults.set(connection.target, status);

      if (isCorrect) {
        correctCount++;
      }
    }

    // Set letter status for unanswered
    if (letterConnections.length === 0 && validCorrectTargetIds.length > 0) {
      letterResults.set(letterId, 'incorrect');
    }
  }

  // Detect multi-letter scenario (multiple letters, single target)
  const isMultiLetter = allLetters.length > 1;

  // For multi-letter, track which letters are correct and which user selected
  let correctLetterIds: number[] | undefined;
  let userSelectedLetterIds: number[] | undefined;

  if (isMultiLetter) {
    // For multi-letter, user still makes connections FROM letter TO target
    const targetId = allCorrectTargets[0]?.id;
    if (targetId) {
      const targetNodeId = `target-quiz-${targetId}`;

      // Get all edges going TO this target
      const targetConnections = edges.filter((e) => e.target === targetNodeId);

      // Extract letter IDs from edge sources
      userSelectedLetterIds = targetConnections.map((c) =>
        Number.parseInt(c.source.replace('letter-quiz-', ''), 10),
      );

      // Correct letter IDs are from questions where this target is in correctTargetIds
      correctLetterIds = questions
        .filter((q) => q.correctTargetIds.includes(targetId))
        .map((q) => q.letter.id);
    }
  }

  // Calculate incorrect count = expected correct - actual correct
  // This is the single source of truth for incorrect calculations
  let incorrectCount: number;
  if (isMultiLetter && correctLetterIds && userSelectedLetterIds) {
    // Multi-letter: expectedCorrect = number of letters that should connect
    // actualCorrect = number of correct letters user selected
    const expectedCorrect = correctLetterIds.length;
    const actualCorrect = userSelectedLetterIds.filter((id) =>
      correctLetterIds.includes(id),
    ).length;
    incorrectCount = expectedCorrect - actualCorrect;
  } else {
    // Single-letter: expectedCorrect = number of correct targets
    // actualCorrect = correctCount (already calculated above)
    const expectedCorrect = allCorrectTargets.length;
    incorrectCount = expectedCorrect - correctCount;
  }

  // Determine overall status for this question
  const isUnanswered = isMultiLetter
    ? (userSelectedLetterIds?.length ?? 0) === 0
    : allUserAnswers.length === 0;

  let isPerfect: boolean;
  if (isMultiLetter && correctLetterIds && userSelectedLetterIds) {
    // For multi-letter: compare letter IDs
    isPerfect =
      !isUnanswered &&
      userSelectedLetterIds.length === correctLetterIds.length &&
      userSelectedLetterIds.every((uid) => correctLetterIds.includes(uid)) &&
      correctLetterIds.every((cid) => userSelectedLetterIds.includes(cid));
  } else {
    // For single-letter: compare targets
    isPerfect =
      !isUnanswered &&
      allUserAnswers.length === allCorrectTargets.length &&
      allUserAnswers.every((ua) =>
        allCorrectTargets.some((ct) => ct.id === ua.id),
      );
  }

  const hasPartialCorrect = !isPerfect && !isUnanswered;

  // Create single analytic for this quiz screen
  const questionAnalytics: ChallengeQuizAnalytic[] = [
    {
      questionNumber,
      letters: allLetters,
      targetType,
      correctTargets: allCorrectTargets,
      displayedTargets,
      userAnswers: allUserAnswers,
      isPerfect,
      hasPartialCorrect,
      isUnanswered,
      correctCount,
      incorrectCount,
      ...(isMultiLetter && {
        correctLetterIds,
        userSelectedLetterIds,
      }),
    },
  ];

  return { correctCount, letterResults, targetResults, questionAnalytics };
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
export function applyResultsToEdges(
  edges: Edge[],
  questions: QuizQuestion[],
): Edge[] {
  return edges.map((edge) => {
    const letterIdNum = Number.parseInt(
      edge.source.replace('letter-quiz-', ''),
      10,
    );
    const targetIdNum = Number.parseInt(
      edge.target.replace('target-quiz-', ''),
      10,
    );
    const question = questions.find((q) => q.letter.id === letterIdNum);
    const isCorrect = question?.correctTargetIds.includes(targetIdNum) || false;

    return {
      ...edge,
      style: { stroke: isCorrect ? '#22c55e' : '#ef4444', strokeWidth: 3 },
      animated: false,
    };
  });
}
