import type { InferOutput } from 'valibot';
import { boolean, integer, number, object, pipe, string } from 'valibot';

/**
 * League Schema
 */
export const LeagueSchema = object({
  id: string(),
  nameKey: string(), // i18n key
  emoji: string(),
});

export type League = InferOutput<typeof LeagueSchema>;

/**
 * Full Leaderboard Entry Schema (extends the existing one with more detail)
 */
export const FullLeaderboardEntrySchema = object({
  rank: pipe(number(), integer()),
  userId: string(),
  name: string(),
  xp: pipe(number(), integer()),
  isCurrentUser: boolean(),
  avatarBg: string(), // Tailwind bg class for avatar
});

export type FullLeaderboardEntry = InferOutput<
  typeof FullLeaderboardEntrySchema
>;

/**
 * User Status Schema (for sidebar)
 */
export const UserStatusSchema = object({
  emoji: string(),
  label: string(),
});

export type UserStatus = InferOutput<typeof UserStatusSchema>;
