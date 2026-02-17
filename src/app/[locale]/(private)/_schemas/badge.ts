import { type InferOutput, object, optional, picklist, string } from 'valibot';
import { EMOJI_BADGE_COLOR_CODES } from '../_lib/colors';

/**
 * Monthly Badge Schema
 */
export const MonthlyBadgeSchema = object({
  id: string(),
  titleKey: string(), // i18n key
  descriptionKey: string(), // i18n key for month/year
  emoji: string(), // emoji icon
  emojiColorCode: optional(picklist([...EMOJI_BADGE_COLOR_CODES])),
});

export type MonthlyBadge = InferOutput<typeof MonthlyBadgeSchema>;
