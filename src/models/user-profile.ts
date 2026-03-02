import type { InferOutput } from 'valibot';
import type {
  RemoteUserProfileSchema,
  UserProfile,
} from '@/schemas/user-profile';

type RemoteUserProfile = InferOutput<typeof RemoteUserProfileSchema>;

export function transformRemoteUserProfile(
  remote: RemoteUserProfile,
): UserProfile {
  return {
    id: remote.id,
    username: remote.username,
    displayName: remote.display_name,
    avatarColorCode: remote.avatar_color_code,
    locale: remote.locale,
    createdAt: remote.created_at,
    updatedAt: remote.updated_at,
  };
}
