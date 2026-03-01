'use server';

import { eq } from 'drizzle-orm';
import { parse } from 'valibot';
import { userProfiles } from '@/db/user-schema';
import { db } from '@/lib/db';
import { transformRemoteUserProfile } from '@/models/user-profile';
import {
  RemoteUserProfileSchema,
  type UserProfile,
} from '@/schemas/user-profile';

export async function getUserProfileByUserId(
  userId: string,
): Promise<UserProfile | null> {
  try {
    const result = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.id, userId))
      .limit(1);

    const row = result[0];
    if (!row) return null;

    const remote = parse(RemoteUserProfileSchema, {
      id: row.id,
      username: row.username,
      display_name: row.displayName,
      avatar_color_code: row.avatarColorCode,
      locale: row.locale,
      created_at: row.createdAt?.toISOString(),
      updated_at: row.updatedAt?.toISOString(),
    });

    return transformRemoteUserProfile(remote);
  } catch (error) {
    console.error('[getUserProfileByUserId] Error:', error);
    return null;
  }
}

export async function getUserProfileByUsername(
  username: string,
): Promise<UserProfile | null> {
  try {
    const result = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.username, username))
      .limit(1);

    const row = result[0];
    if (!row) return null;

    const remote = parse(RemoteUserProfileSchema, {
      id: row.id,
      username: row.username,
      display_name: row.displayName,
      avatar_color_code: row.avatarColorCode,
      locale: row.locale,
      created_at: row.createdAt?.toISOString(),
      updated_at: row.updatedAt?.toISOString(),
    });

    return transformRemoteUserProfile(remote);
  } catch (error) {
    console.error('[getUserProfileByUsername] Error:', error);
    return null;
  }
}
