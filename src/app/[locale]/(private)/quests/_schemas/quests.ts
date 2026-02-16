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
  colorCode: string(), // Color code for gradient (e.g., "indigo", "rose", "emerald")
  iconEmoji: string(), // Emoji icon for reward
  iconBg: string(), // Tailwind bg class for reward icon
});

export type MonthlyQuest = InferOutput<typeof MonthlyQuestSchema>;
