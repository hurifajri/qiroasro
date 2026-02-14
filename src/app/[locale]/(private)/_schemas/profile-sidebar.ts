import type { InferOutput } from 'valibot';
import { array, integer, number, object, pipe, string } from 'valibot';

/**
 * Activity Feed Item Schema
 */
export const ActivityFeedItemSchema = object({
  id: string(),
  userName: string(),
  avatarUrl: string(),
  timeAgo: string(), // e.g., "40 mins", "1 day"
  descriptionKey: string(), // i18n key
  reactionEmojis: array(string()), // e.g., ["🎉", "😊"]
  reactionCount: pipe(number(), integer()),
});

export type ActivityFeedItem = InferOutput<typeof ActivityFeedItemSchema>;

/**
 * Follow Entry Schema (for Following/Followers tabs)
 */
export const FollowEntrySchema = object({
  id: string(),
  name: string(),
  avatarUrl: string(),
  xp: pipe(number(), integer()),
});

export type FollowEntry = InferOutput<typeof FollowEntrySchema>;
