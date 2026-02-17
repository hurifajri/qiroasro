import type { InferOutput } from 'valibot';
import {
  array,
  boolean,
  integer,
  isoDateTime,
  number,
  object,
  optional,
  pipe,
  string,
} from 'valibot';

/**
 * User profile schema
 */
export const UserProfileSchema = object({
  username: string(),
  displayName: string(),
  avatarColorCode: optional(string()),
  joinedDate: pipe(string(), isoDateTime()), // UTC ISO datetime string
  followingCount: pipe(number(), integer()),
  followersCount: pipe(number(), integer()),
});

export type UserProfile = InferOutput<typeof UserProfileSchema>;

/**
 * Statistic schema
 */
export const StatisticSchema = object({
  id: string(),
  labelKey: string(), // i18n key
  value: pipe(number(), integer()),
  icon: string(), // lucide icon name
});

export type Statistic = InferOutput<typeof StatisticSchema>;

/**
 * Friend suggestion schema
 */
export const FriendSuggestionSchema = object({
  id: string(),
  username: string(),
  displayName: string(),
  avatarColorCode: optional(string()),
  mutualFriendsCount: pipe(number(), integer()),
  isFollowing: boolean(),
});

export type FriendSuggestion = InferOutput<typeof FriendSuggestionSchema>;

/**
 * Achievement schema
 */
export const AchievementSchema = object({
  id: string(),
  titleKey: string(), // i18n key
  descriptionKey: string(), // i18n key
  emojiColorCode: string(), // Tailwind color
  emoji: string(),
  level: pipe(number(), integer()),
});

export type Achievement = InferOutput<typeof AchievementSchema>;

/**
 * Collection schemas
 */
export const StatisticsSchema = array(StatisticSchema);
export const FriendSuggestionsSchema = array(FriendSuggestionSchema);
export const AchievementsSchema = array(AchievementSchema);
