import {
  type InferOutput,
  integer,
  number,
  object,
  optional,
  picklist,
  pipe,
  string,
} from 'valibot';
import { EMOJI_BADGE_COLOR_CODES } from '../_lib/colors';

/**
 * Monthly Badge Schema
 */
export const MonthlyBadgeSchema = object({
  id: pipe(number(), integer()),
  titleKey: string(), // i18n key
  dateKey: string(), // i18n key for month/year
  emoji: string(), // emoji icon
  emojiColorCode: optional(picklist([...EMOJI_BADGE_COLOR_CODES])),
});

export type MonthlyBadge = InferOutput<typeof MonthlyBadgeSchema>;
