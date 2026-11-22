import type { InferOutput } from 'valibot';
import {
  maxLength,
  minLength,
  object,
  picklist,
  pipe,
  regex,
  string,
  transform,
} from 'valibot';

import type { userProfiles } from '@/db/user-schema';
import {
  AVATAR_GRADIENT_CODES,
  AVATAR_SOLID_CODES,
  type AvatarColorCode,
} from '@/lib/avatar';

export type UserProfile = typeof userProfiles.$inferSelect;

// =====================================================================
// UPDATE PROFILE SCHEMA (for mutation & form input validation)
// =====================================================================

export const UpdateUserProfileSchema = object({
  avatarColorCode: picklist([...AVATAR_SOLID_CODES, ...AVATAR_GRADIENT_CODES]),
  displayName: pipe(
    string(),
    minLength(1, 'display_name_required'),
    maxLength(80, 'display_name_max_length'),
  ),
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
});

export type UpdateUserProfile = InferOutput<typeof UpdateUserProfileSchema>;

// =====================================================================
// PROFILE COLLECTIONS / EXTENSIONS
// =====================================================================

export interface Statistic {
  id: string;
  labelKey: string;
  value: string | number;
  icon: string;
}

export interface FriendSuggestion {
  id: string;
  username: string;
  displayName: string;
  avatarColorCode?: AvatarColorCode;
  mutualFriendsCount: number;
  isFollowing: boolean;
}
