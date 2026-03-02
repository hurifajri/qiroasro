import type { InferOutput } from 'valibot';
import { boolean, integer, number, object, pipe, string } from 'valibot';

/**
 * Full Leaderboard Entry Schema (extends the existing one with more detail)
 */
export const FullLeaderboardEntrySchema = object({
  rank: pipe(number(), integer()),
  userId: string(),
  name: string(),
  xp: pipe(number(), integer()),
  isCurrentUser: boolean(),
});

export type FullLeaderboardEntry = InferOutput<
  typeof FullLeaderboardEntrySchema
>;
