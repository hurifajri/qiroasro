import { type InferOutput, object, string } from 'valibot';

/**
 * League Schema
 */
export const LeagueSchema = object({
  id: string(),
  nameKey: string(), // i18n key
  emoji: string(),
});

export type League = InferOutput<typeof LeagueSchema>;
