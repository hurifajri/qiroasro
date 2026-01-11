import type { Letter } from '@/schemas/letter';
import type { QuizStatus } from './quiz';

export type LetterQuiz = Letter & { status: QuizStatus };
