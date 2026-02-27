import { object, optional, string } from 'valibot';

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
