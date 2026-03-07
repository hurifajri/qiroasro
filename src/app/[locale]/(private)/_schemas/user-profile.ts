import type { InferOutput } from 'valibot';
import {
  array,
  boolean,
  date,
  integer,
  maxLength,
  minLength,
  number,
  object,
  optional,
  picklist,
  pipe,
  regex,
  string,
  transform,
  union,
} from 'valibot';
import { AVATAR_GRADIENT_CODES, AVATAR_SOLID_CODES } from '@/lib/avatar';

// =====================================================================
// LOCAL SCHEMA (camelCase, used throughout the app)
// =====================================================================

export const UserProfileSchema = object({
  id: string(),
  username: pipe(
    string(),
    transform((v) => v.toLowerCase()), // normalize to lowercase
    minLength(3, 'username_min_length'),
    maxLength(30, 'username_max_length'),
    // Rules: alphanumeric start/end, underscores allowed in middle,
    // no consecutive underscores, single char also valid
    regex(
      /^(?!.*__)[a-z0-9][a-z0-9_]*[a-z0-9]$|^[a-z0-9]$/,
      'username_pattern',
    ),
  ),
  displayName: pipe(
    string(),
    minLength(1, 'display_name_required'),
    maxLength(80, 'display_name_max_length'),
  ),
  avatarColorCode: picklist([...AVATAR_SOLID_CODES, ...AVATAR_GRADIENT_CODES]),
  locale: string(),
  createdAt: date(),
  updatedAt: date(),
  followingCount: pipe(number(), integer()),
  followersCount: pipe(number(), integer()),
});

export type UserProfile = InferOutput<typeof UserProfileSchema>;

// =====================================================================
// UPDATE PROFILE SCHEMA (for mutation input validation)
// =====================================================================

export const UpdateUserProfileSchema = object({
  displayName: UserProfileSchema.entries.displayName,
  avatarColorCode: UserProfileSchema.entries.avatarColorCode,
  username: optional(UserProfileSchema.entries.username),
});

export type UpdateUserProfile = InferOutput<typeof UpdateUserProfileSchema>;

// =====================================================================
// PROFILE COLLECTIONS / EXTENSIONS
// =====================================================================

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
