import type { InferOutput } from 'valibot';
import {
  maxLength,
  minLength,
  object,
  optional,
  pipe,
  regex,
  string,
} from 'valibot';

// =====================================================================
// REMOTE SCHEMA (DB row shape — snake_case)
// =====================================================================

export const RemoteUserProfileSchema = object({
  id: string(),
  username: string(),
  display_name: string(),
  avatar_color_code: string(),
  locale: string(),
  created_at: optional(string()),
  updated_at: optional(string()),
});

// =====================================================================
// LOCAL TYPE (camelCase, used throughout the app)
// =====================================================================

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarColorCode: string;
  locale: string;
  createdAt?: string;
  updatedAt?: string;
}

// =====================================================================
// UPDATE PROFILE SCHEMA (for mutation input validation)
// =====================================================================

/**
 * Username: 3-30 chars, lowercase alphanumeric + underscores only.
 * No leading/trailing underscores.
 */
const UsernameSchema = pipe(
  string(),
  minLength(3, 'Username must be at least 3 characters'),
  maxLength(30, 'Username must be at most 30 characters'),
  regex(
    /^[a-z0-9][a-z0-9_]*[a-z0-9]$|^[a-z0-9]$/,
    'Username can only contain lowercase letters, numbers, and underscores',
  ),
);

export const UpdateUserProfileSchema = object({
  displayName: pipe(
    string(),
    minLength(1, 'Display name is required'),
    maxLength(80, 'Display name must be at most 80 characters'),
  ),
  avatarColorCode: optional(string()),
  username: optional(UsernameSchema),
});

export type UpdateUserProfile = InferOutput<typeof UpdateUserProfileSchema>;
