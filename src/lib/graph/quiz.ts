import type { Node } from '@xyflow/react';
import type { Letter } from '@/schemas/letter';

export type QuizMode = 'makhraj' | 'sifat';
export type QuizStatus = 'none' | 'correct' | 'incorrect';

export type LetterQuiz = Letter & {
  status: QuizStatus;
};

export function createLetterQuizNode(
  letter: LetterQuiz,
  position: { x: number; y: number } = { x: 0, y: 0 },
): Node {
  return {
    id: `letter-quiz-${letter.id}`,
    type: 'letterQuiz',
    position,
    data: letter,
    draggable: false,
  };
}
