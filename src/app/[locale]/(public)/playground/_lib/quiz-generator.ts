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
import type { Trait, TraitGroup } from '../_schemas/trait';
import { createLetterQuizNode, createTargetQuizNode } from './node';

interface QuizGeneratorData {
  letters: Letter[];
  letterArticulations: LetterArticulation[];
  letterTraits: LetterTrait[];
  articulationPoints: ArticulationPoint[];
  traits: Trait[];
  traitGroups: TraitGroup[];
}

function shuffleArray<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
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
    traitGroups,
  } = data;
  const { lettersPerQuiz, targetsPerQuiz, multiEdge, specificLetterId } =
    settings;

  const lazimahGroupIds = new Set(
    traitGroups.filter((group) => group.isLazimah).map((group) => group.id),
  );
  const validTraitIds = new Set(
    traits
      .filter((t) => traitGroups.length === 0 || lazimahGroupIds.has(t.groupId))
      .map((t) => t.id),
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

  const shuffledLetters = shuffleArray(availableLetters);

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

  if (
    !isSupportedConfig ||
    shuffledLetters.length === 0 ||
    allTargets.length === 0
  ) {
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

  if (newQuestions.length === 0 || selectedTargets.length === 0) {
    return {
      questions: [],
      targets: [],
      nodes: [],
      edges: [],
      isUnsupported: true,
    };
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
  const shuffledCorrectIds = shuffleArray(letterCorrectIds);
  const selectedTargetId = shuffledCorrectIds[0];
  if (selectedTargetId === undefined) {
    return { questions: [], targets: [] };
  }

  const questions: QuizQuestion[] = [
    { letter, correctTargetIds: [selectedTargetId], targetType: type },
  ];

  const correctTarget = allTargets.find((t) => t.id === selectedTargetId);
  const distractorTargets = shuffleArray(
    allTargets.filter((t) => !letterCorrectIds.includes(t.id)),
  ).slice(0, settings.targetsPerQuiz - 1);

  const targets = correctTarget
    ? shuffleArray([correctTarget, ...distractorTargets])
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

  const correctTargets = shuffleArray(
    allTargets.filter((t) => letterCorrectIds.includes(t.id)),
  ).slice(0, settings.targetsPerQuiz - 1);

  const distractorTarget = shuffleArray(
    allTargets.filter((t) => !letterCorrectIds.includes(t.id)),
  )[0];

  const targets = distractorTarget
    ? shuffleArray([...correctTargets, distractorTarget])
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
  const shuffledCorrectIds = shuffleArray(firstLetterCorrectIds);
  const selectedTargetId = shuffledCorrectIds[0];
  if (selectedTargetId === undefined) {
    return { questions: [], targets: [] };
  }

  const distractorLetters = shuffledLetters.slice(1).filter((letter) => {
    const letterTargetIds = getCorrectTargetIds(letter);
    return !letterTargetIds.includes(selectedTargetId);
  });

  const selectedLetters = [
    firstLetter,
    ...distractorLetters.slice(0, settings.lettersPerQuiz - 1),
  ];
  const questions: QuizQuestion[] = shuffleArray(
    selectedLetters.map((letter, index) => ({
      letter,
      correctTargetIds: index === 0 ? [selectedTargetId] : [],
      targetType: type,
    })),
  );

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
  const shuffledTargets = shuffleArray(allTargets);
  const targetItem = shuffledTargets[0];
  if (!targetItem) {
    return { questions: [], targets: [] };
  }

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
    ? shuffleArray([...correctLetters, distractorLetter])
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
