import type { InferOutput } from 'valibot';
import {
  integer,
  number,
  object,
  optional,
  picklist,
  pipe,
  string,
} from 'valibot';

import { CARD_COLOR_CODES, EMOJI_COLOR_CODES } from '@/lib/colors';

/**
 * Monthly Quest Schema
 */
export const MonthlyQuestSchema = object({
  month: pipe(number(), integer()), // 1-12 for January-December
  titleKey: string(), // i18n key
  target: pipe(number(), integer()),
  current: pipe(number(), integer()),
  daysRemaining: pipe(number(), integer()),
  colorCode: optional(picklist([...CARD_COLOR_CODES])),
  emoji: string(), // Emoji icon for reward
  emojiColorCode: optional(picklist([...EMOJI_COLOR_CODES])),
});

export type MonthlyQuest = InferOutput<typeof MonthlyQuestSchema>;
