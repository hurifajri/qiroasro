import * as z from 'zod';
import { LetterSchema } from '@/schemas/letter';
import { QuizStatusSchema } from './graph';

const LetterQuizSchema = z.object({ ...LetterSchema.shape, status: QuizStatusSchema });

export type LetterQuiz = z.infer<typeof LetterQuizSchema>;
