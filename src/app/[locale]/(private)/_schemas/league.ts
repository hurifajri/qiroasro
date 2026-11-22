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

export type LeagueNameKey = (typeof LEAGUE_NAME_KEYS)[number];

export interface League {
  id: string;
  nameKey: LeagueNameKey;
  emoji: string;
}
