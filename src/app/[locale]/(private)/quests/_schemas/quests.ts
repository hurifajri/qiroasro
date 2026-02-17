import type { InferOutput } from 'valibot';
import { integer, number, object, pipe, string } from 'valibot';

/**
 * Monthly Quest Schema
 */
export const MonthlyQuestSchema = object({
  month: pipe(number(), integer()), // 1-12 for January-December
  titleKey: string(), // i18n key
  target: pipe(number(), integer()),
  current: pipe(number(), integer()),
  daysRemaining: pipe(number(), integer()),
  colorCode: string(), // Color code for gradient (e.g., "sky", "rose")
  emoji: string(), // Emoji icon for reward
  emojiColorCode: string(), // Color code for emoji bg (e.g., "sky_blue", "orange_red")
});

export type MonthlyQuest = InferOutput<typeof MonthlyQuestSchema>;
