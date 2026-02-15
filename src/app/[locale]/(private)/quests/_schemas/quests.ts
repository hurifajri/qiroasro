import type { InferOutput } from 'valibot';
import { integer, number, object, pipe, string } from 'valibot';

/**
 * Monthly Quest Schema
 */
export const MonthlyQuestSchema = object({
  month: string(), // e.g., "FEBRUARY"
  titleKey: string(), // i18n key
  target: pipe(number(), integer()),
  current: pipe(number(), integer()),
  daysRemaining: pipe(number(), integer()),
});

export type MonthlyQuest = InferOutput<typeof MonthlyQuestSchema>;
