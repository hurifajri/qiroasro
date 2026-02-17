import { type InferOutput, object, picklist, string } from 'valibot';

/**
 * League Schema
 */
export const LEAGUE_NAME_KEYS = [
  'leagues.peace',
  'leagues.stability',
  'leagues.security',
  'leagues.merit',
  'leagues.honor',
  'leagues.eternity',
  'leagues.shelter',
  'leagues.bliss',
  'leagues.eden',
  'leagues.paradise',
] as const;

/**
 * League Schema
 */
export const LeagueSchema = object({
  id: string(),
  nameKey: picklist(LEAGUE_NAME_KEYS), // i18n key
  emoji: string(),
});

export type League = InferOutput<typeof LeagueSchema>;
