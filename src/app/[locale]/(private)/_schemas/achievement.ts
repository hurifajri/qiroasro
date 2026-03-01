import type { InferOutput } from 'valibot';
import {
  array,
  integer,
  number,
  object,
  optional,
  picklist,
  pipe,
  string,
} from 'valibot';
import { EMOJI_COLOR_CODES } from '@/lib/colors';

/**
 * Achievement schema
 */
export const AchievementSchema = object({
  id: string(),
  titleKey: string(), // i18n key
  descriptionKey: string(), // i18n key
  emojiColorCode: optional(picklist([...EMOJI_COLOR_CODES])),
  emoji: string(),
  levels: array(pipe(number(), integer())),
  level: pipe(number(), integer()),
});

export type Achievement = InferOutput<typeof AchievementSchema>;
export const AchievementsSchema = array(AchievementSchema);
