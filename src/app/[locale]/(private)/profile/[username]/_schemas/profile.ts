import type { InferOutput } from 'valibot';
import {
  array,
  boolean,
  integer,
  isoDateTime,
  number,
  object,
  optional,
  picklist,
  pipe,
  string,
  union,
} from 'valibot';
import { AVATAR_GRADIENT_CODES, AVATAR_SOLID_CODES } from '@/lib/avatar';

/**
 * User profile schema
 */
export const UserProfileSchema = object({
  username: string(),
  displayName: string(),
  avatarColorCode: optional(
    picklist([...AVATAR_SOLID_CODES, ...AVATAR_GRADIENT_CODES]),
  ),
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
  value: union([string(), pipe(number(), integer())]),
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
  avatarColorCode: optional(
    picklist([...AVATAR_SOLID_CODES, ...AVATAR_GRADIENT_CODES]),
  ),
  mutualFriendsCount: pipe(number(), integer()),
  isFollowing: boolean(),
});

export type FriendSuggestion = InferOutput<typeof FriendSuggestionSchema>;

/**
 * Collection schemas
 */
export const StatisticsSchema = array(StatisticSchema);
export const FriendSuggestionsSchema = array(FriendSuggestionSchema);
