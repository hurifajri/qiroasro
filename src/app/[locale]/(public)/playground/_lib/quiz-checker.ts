import type { Edge, Node } from '@xyflow/react';
import type {
  ChallengeQuizAnalytic,
  QuizQuestion,
  QuizTarget,
} from '../_schemas/quiz';

interface CalculateAnswerResult {
  correctCount: number;
  letterResults: Map<string, 'correct' | 'incorrect'>;
  targetResults: Map<string, 'correct' | 'incorrect'>;
  questionAnalytics: ChallengeQuizAnalytic[];
}

interface QuestionConnectionsEvaluation {
  correctCount: number;
  wrongConnectionCount: number;
  correctTargets: QuizTarget[];
  userAnswers: QuizTarget[];
}

function evaluateQuestionConnections(
  question: QuizQuestion,
  edges: Edge[],
  displayedTargets: QuizTarget[],
  displayedTargetIds: Set<number>,
  letterResults: Map<string, 'correct' | 'incorrect'>,
  targetResults: Map<string, 'correct' | 'incorrect'>,
): QuestionConnectionsEvaluation {
  const letterId = `letter-quiz-${question.letter.id}`;
  const letterConnections = edges.filter((e) => e.source === letterId);

  const validCorrectTargetIdSet = new Set(
    question.correctTargetIds.filter((id) => displayedTargetIds.has(id)),
  );
  const correctTargets = displayedTargets.filter((t) =>
    validCorrectTargetIdSet.has(t.id),
  );

  const userAnswerIds = new Set(
    letterConnections.map((c) =>
      Number.parseInt(c.target.replace('target-quiz-', ''), 10),
    ),
  );
  const userAnswers = displayedTargets.filter((t) => userAnswerIds.has(t.id));

  let correctCount = 0;
  let wrongConnectionCount = 0;

  for (const connection of letterConnections) {
    const targetIdNum = Number.parseInt(
      connection.target.replace('target-quiz-', ''),
      10,
    );
    const isCorrect = validCorrectTargetIdSet.has(targetIdNum);
    targetResults.set(connection.target, isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      correctCount++;
    } else {
      wrongConnectionCount++;
    }
  }

  if (correctCount > 0) {
    letterResults.set(letterId, 'correct');
  } else if (letterConnections.length > 0 || validCorrectTargetIdSet.size > 0) {
    letterResults.set(letterId, 'incorrect');
  }

  return { correctCount, wrongConnectionCount, correctTargets, userAnswers };
}

function getMultiLetterSelection(
  questions: QuizQuestion[],
  edges: Edge[],
  targetId: number | undefined,
): {
  correctLetterIds?: number[];
  userSelectedLetterIds?: number[];
} {
  if (!targetId) return {};

  const targetNodeId = `target-quiz-${targetId}`;
  const userSelectedLetterIds = edges
    .filter((e) => e.target === targetNodeId)
    .map((c) => Number.parseInt(c.source.replace('letter-quiz-', ''), 10));

  const correctLetterIds = questions
    .filter((q) => q.correctTargetIds.includes(targetId))
    .map((q) => q.letter.id);

  return { correctLetterIds, userSelectedLetterIds };
}

function evaluateQuestionOutcome(params: {
  isMultiLetter: boolean;
  correctLetterIds?: number[];
  userSelectedLetterIds?: number[];
  allCorrectTargets: QuizTarget[];
  allUserAnswers: QuizTarget[];
  correctCount: number;
  wrongConnectionCount: number;
}): {
  incorrectCount: number;
  isUnanswered: boolean;
  isPerfect: boolean;
  hasPartialCorrect: boolean;
} {
  const {
    isMultiLetter,
    correctLetterIds,
    userSelectedLetterIds,
    allCorrectTargets,
    allUserAnswers,
    correctCount,
    wrongConnectionCount,
  } = params;

  if (isMultiLetter && correctLetterIds && userSelectedLetterIds) {
    const correctLetterIdSet = new Set(correctLetterIds);
    const selectedLetterIdSet = new Set(userSelectedLetterIds);
    const actualCorrect = userSelectedLetterIds.filter((id) =>
      correctLetterIdSet.has(id),
    ).length;
    const incorrectCount = Math.max(
      correctLetterIds.length - actualCorrect,
      wrongConnectionCount,
    );
    const isUnanswered = userSelectedLetterIds.length === 0;
    const isPerfect =
      !isUnanswered &&
      userSelectedLetterIds.length === correctLetterIds.length &&
      userSelectedLetterIds.every((uid) => correctLetterIdSet.has(uid)) &&
      correctLetterIds.every((cid) => selectedLetterIdSet.has(cid));

    return {
      incorrectCount,
      isUnanswered,
      isPerfect,
      hasPartialCorrect: !isPerfect && !isUnanswered,
    };
  }

  const correctTargetIdSet = new Set(allCorrectTargets.map((ct) => ct.id));
  const incorrectCount = Math.max(
    allCorrectTargets.length - correctCount,
    wrongConnectionCount,
  );
  const isUnanswered = allUserAnswers.length === 0;
  const isPerfect =
    !isUnanswered &&
    allUserAnswers.length === allCorrectTargets.length &&
    allUserAnswers.every((ua) => correctTargetIdSet.has(ua.id));

  return {
    incorrectCount,
    isUnanswered,
    isPerfect,
    hasPartialCorrect: !isPerfect && !isUnanswered,
  };
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
  let wrongConnectionCount = 0;
  const letterResults: Map<string, 'correct' | 'incorrect'> = new Map();
  const targetResults: Map<string, 'correct' | 'incorrect'> = new Map();

  const allLetters: ChallengeQuizAnalytic['letters'] = [];
  const allCorrectTargets: QuizTarget[] = [];
  const allUserAnswers: QuizTarget[] = [];
  const targetType = questions[0]?.targetType || 'articulation_point';
  const displayedTargetIds = new Set(displayedTargets.map((t) => t.id));

  for (const question of questions) {
    allLetters.push({
      id: question.letter.id,
      symbol: question.letter.symbol,
      tafkhimType: question.letter.tafkhimType,
    });

    const evaluation = evaluateQuestionConnections(
      question,
      edges,
      displayedTargets,
      displayedTargetIds,
      letterResults,
      targetResults,
    );

    correctCount += evaluation.correctCount;
    wrongConnectionCount += evaluation.wrongConnectionCount;
    allCorrectTargets.push(...evaluation.correctTargets);
    allUserAnswers.push(...evaluation.userAnswers);
  }

  const isMultiLetter = allLetters.length > 1;
  const { correctLetterIds, userSelectedLetterIds } = isMultiLetter
    ? getMultiLetterSelection(questions, edges, allCorrectTargets[0]?.id)
    : {};

  const { incorrectCount, isUnanswered, isPerfect, hasPartialCorrect } =
    evaluateQuestionOutcome({
      isMultiLetter,
      correctLetterIds,
      userSelectedLetterIds,
      allCorrectTargets,
      allUserAnswers,
      correctCount,
      wrongConnectionCount,
    });

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
