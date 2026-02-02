import type { Edge, Node } from '@xyflow/react';
import type { ArticulationPoint } from '../_schemas/articulation';
import type {
  Letter,
  LetterArticulation,
  LetterTrait,
} from '../_schemas/letter';
import type { TargetQuizNodeData } from '../_schemas/node';
import type {
  QuizLetter,
  QuizQuestion,
  QuizTarget,
  QuizType,
} from '../_schemas/quiz';
import type { Trait } from '../_schemas/trait';
import { createLetterQuizNode, createTargetQuizNode } from './node';

interface QuizGeneratorData {
  letters: Letter[];
  letterArticulations: LetterArticulation[];
  letterTraits: LetterTrait[];
  articulationPoints: ArticulationPoint[];
  traits: Trait[];
}

interface QuizSettings {
  lettersPerQuiz: number;
  targetsPerQuiz: number;
  multiEdge: boolean;
  specificLetterId: number | null;
}

export interface GeneratedQuizResult {
  questions: QuizQuestion[];
  targets: QuizTarget[];
  nodes: Node[];
  edges: Edge[];
  isUnsupported: boolean;
}

/**
 * Pure function to generate quiz data without side effects.
 * Returns all the data needed to set up a quiz.
 */
export function generateQuizData(
  type: QuizType,
  data: QuizGeneratorData,
  settings: QuizSettings,
): GeneratedQuizResult {
  const {
    letters,
    letterArticulations,
    letterTraits,
    articulationPoints,
    traits,
  } = data;
  const { lettersPerQuiz, targetsPerQuiz, multiEdge, specificLetterId } =
    settings;

  const validTraitIds = new Set(
    traits.filter((t) => t.groupId !== 7).map((t) => t.id),
  );

  // Filter by specific letter if provided
  const lettersPool =
    specificLetterId !== null
      ? letters.filter((letter) => letter.id === specificLetterId)
      : letters;

  const availableLetters = lettersPool.filter((letter) => {
    if (type === 'articulation_point') {
      return letterArticulations.some((la) => la.letterId === letter.id);
    }
    return letterTraits.some(
      (lt) => lt.letterId === letter.id && validTraitIds.has(lt.traitId),
    );
  });

  const shuffledLetters = [...availableLetters].sort(() => Math.random() - 0.5);

  const allTargets: QuizTarget[] =
    type === 'articulation_point'
      ? articulationPoints.map((ap) => ({ id: ap.id, slug: ap.slug }))
      : traits
          .filter((t) => validTraitIds.has(t.id))
          .map((t) => ({ id: t.id, slug: t.slug }));

  const getCorrectTargetIds = (letter: Letter): number[] => {
    if (type === 'articulation_point') {
      return letterArticulations
        .filter((la) => la.letterId === letter.id)
        .map((la) => la.pointId);
    }
    return letterTraits
      .filter(
        (lt) => lt.letterId === letter.id && validTraitIds.has(lt.traitId),
      )
      .map((lt) => lt.traitId);
  };

  // Determine quiz case
  const isCase1 = !multiEdge && lettersPerQuiz === 1 && targetsPerQuiz > 1;
  const isCase2 = multiEdge && lettersPerQuiz === 1 && targetsPerQuiz > 1;
  const isCase3 = !multiEdge && lettersPerQuiz > 1 && targetsPerQuiz === 1;
  const isCase4 = multiEdge && lettersPerQuiz > 1 && targetsPerQuiz === 1;
  const isSupportedConfig = isCase1 || isCase2 || isCase3 || isCase4;

  if (!isSupportedConfig) {
    return {
      questions: [],
      targets: [],
      nodes: [],
      edges: [],
      isUnsupported: true,
    };
  }

  let newQuestions: QuizQuestion[] = [];
  let selectedTargets: QuizTarget[] = [];

  if (isCase1) {
    const result = generateCase1(
      shuffledLetters,
      allTargets,
      getCorrectTargetIds,
      type,
      settings,
    );
    newQuestions = result.questions;
    selectedTargets = result.targets;
  } else if (isCase2) {
    const result = generateCase2(
      shuffledLetters,
      allTargets,
      getCorrectTargetIds,
      type,
      settings,
    );
    newQuestions = result.questions;
    selectedTargets = result.targets;
  } else if (isCase3) {
    const result = generateCase3(
      shuffledLetters,
      allTargets,
      getCorrectTargetIds,
      type,
      settings,
    );
    newQuestions = result.questions;
    selectedTargets = result.targets;
  } else if (isCase4) {
    const result = generateCase4(
      shuffledLetters,
      allTargets,
      getCorrectTargetIds,
      type,
      settings,
    );
    newQuestions = result.questions;
    selectedTargets = result.targets;
  }

  const letterNodes: Node[] = newQuestions.map((q, index) => {
    const letter: QuizLetter = { ...q.letter, status: 'none' };
    const position = { x: 50, y: 30 + index * 70 };
    return createLetterQuizNode(letter, position);
  });

  const targetNodes: Node[] = selectedTargets.map((q, index) => {
    const target: TargetQuizNodeData = {
      id: q.id,
      slug: q.slug,
      type,
      status: 'none',
    };
    const position = { x: 200, y: 20 + index * 60 };
    return createTargetQuizNode(target, position);
  });

  return {
    questions: newQuestions,
    targets: selectedTargets,
    nodes: [...letterNodes, ...targetNodes],
    edges: [],
    isUnsupported: false,
  };
}

// Case 1: Single letter, multiple targets, single answer
function generateCase1(
  shuffledLetters: Letter[],
  allTargets: QuizTarget[],
  getCorrectTargetIds: (letter: Letter) => number[],
  type: QuizType,
  settings: QuizSettings,
) {
  const letter = shuffledLetters[0];
  const letterCorrectIds = getCorrectTargetIds(letter);
  const shuffledCorrectIds = [...letterCorrectIds].sort(
    () => Math.random() - 0.5,
  );
  const selectedTargetId = shuffledCorrectIds[0];

  const questions: QuizQuestion[] = [
    { letter, correctTargetIds: [selectedTargetId], targetType: type },
  ];

  const correctTarget = allTargets.find((t) => t.id === selectedTargetId);
  const distractorTargets = allTargets
    .filter((t) => !letterCorrectIds.includes(t.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, settings.targetsPerQuiz - 1);

  const targets = correctTarget
    ? [correctTarget, ...distractorTargets].sort(() => Math.random() - 0.5)
    : distractorTargets;

  return { questions, targets };
}

// Case 2: Single letter, multiple targets, multiple answers
function generateCase2(
  shuffledLetters: Letter[],
  allTargets: QuizTarget[],
  getCorrectTargetIds: (letter: Letter) => number[],
  type: QuizType,
  settings: QuizSettings,
) {
  const letter = shuffledLetters[0];
  const letterCorrectIds = getCorrectTargetIds(letter);

  const questions: QuizQuestion[] = [
    { letter, correctTargetIds: letterCorrectIds, targetType: type },
  ];

  const correctTargets = allTargets
    .filter((t) => letterCorrectIds.includes(t.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, settings.targetsPerQuiz - 1);

  const distractorTarget = allTargets
    .filter((t) => !letterCorrectIds.includes(t.id))
    .sort(() => Math.random() - 0.5)[0];

  const targets = distractorTarget
    ? [...correctTargets, distractorTarget].sort(() => Math.random() - 0.5)
    : correctTargets;

  return { questions, targets };
}

// Case 3: Multiple letters, single target, single answer
function generateCase3(
  shuffledLetters: Letter[],
  allTargets: QuizTarget[],
  getCorrectTargetIds: (letter: Letter) => number[],
  type: QuizType,
  settings: QuizSettings,
) {
  const firstLetter = shuffledLetters[0];
  const firstLetterCorrectIds = getCorrectTargetIds(firstLetter);
  const shuffledCorrectIds = [...firstLetterCorrectIds].sort(
    () => Math.random() - 0.5,
  );
  const selectedTargetId = shuffledCorrectIds[0];

  const distractorLetters = shuffledLetters.slice(1).filter((letter) => {
    const letterTargetIds = getCorrectTargetIds(letter);
    return !letterTargetIds.includes(selectedTargetId);
  });

  const selectedLetters = [
    firstLetter,
    ...distractorLetters.slice(0, settings.lettersPerQuiz - 1),
  ];
  const questions: QuizQuestion[] = selectedLetters
    .map((letter, index) => ({
      letter,
      correctTargetIds: index === 0 ? [selectedTargetId] : [],
      targetType: type,
    }))
    .sort(() => Math.random() - 0.5);

  const targets = allTargets.filter((t) => t.id === selectedTargetId);

  return { questions, targets };
}

// Case 4: Multiple letters, single target, multiple answers
function generateCase4(
  shuffledLetters: Letter[],
  allTargets: QuizTarget[],
  getCorrectTargetIds: (letter: Letter) => number[],
  type: QuizType,
  settings: QuizSettings,
) {
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

  const correctLetters = lettersWithTarget.slice(
    0,
    settings.lettersPerQuiz - 1,
  );
  const selectedLetters = distractorLetter
    ? [...correctLetters, distractorLetter].sort(() => Math.random() - 0.5)
    : correctLetters;

  const questions: QuizQuestion[] = selectedLetters.map((letter) => {
    const letterTargetIds = getCorrectTargetIds(letter);
    const isCorrect = letterTargetIds.includes(targetItem.id);
    return {
      letter,
      correctTargetIds: isCorrect ? [targetItem.id] : [],
      targetType: type,
    };
  });

  return { questions, targets: [targetItem] };
}
