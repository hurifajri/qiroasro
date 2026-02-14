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

/**
 * Monthly Badge Schema
 */
export const MonthlyBadgeSchema = object({
  id: pipe(number(), integer()),
  titleKey: string(), // i18n key
  dateKey: string(), // i18n key for month/year
  iconEmoji: string(), // emoji icon
  iconBg: string(), // Tailwind bg class
});

export type MonthlyBadge = InferOutput<typeof MonthlyBadgeSchema>;
