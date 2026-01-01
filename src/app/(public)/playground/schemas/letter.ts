import type { Letter } from '@/schemas/letter';
import type { QuizStatus } from './graph';

export type LetterQuiz = Letter & { status: QuizStatus };
