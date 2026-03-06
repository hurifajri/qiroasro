'use server';

import { eq } from 'drizzle-orm';
import { parse } from 'valibot';
import { userProfiles } from '@/db/user-schema';
import { db } from '@/lib/db';
import { transformRemoteUserProfile } from '../_models/user-profile';
import {
  RemoteUserProfileSchema,
  type UpdateUserProfile,
  UpdateUserProfileSchema,
  type UserProfile,
} from '../_schemas/user-profile';

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

export type UsernameAvailability =
  | { available: true }
  | { available: false; reason: 'taken' | 'invalid' };

/**
 * Check if a username is available (not taken by another user).
 * currentUserId is excluded from the check (the user can keep their own username).
 */
export async function checkUsernameAvailability(
  username: string,
  currentUserId: string,
): Promise<UsernameAvailability> {
  try {
    const result = await db
      .select({ id: userProfiles.id })
      .from(userProfiles)
      .where(eq(userProfiles.username, username))
      .limit(1);

    const existing = result[0];

    // Username is taken by another user
    if (existing && existing.id !== currentUserId) {
      return { available: false, reason: 'taken' };
    }

    return { available: true };
  } catch (error) {
    console.error('[checkUsernameAvailability] Error:', error);
    return { available: false, reason: 'invalid' };
  }
}

export type UpdateUserProfileResult =
  | { success: true; profile: UserProfile }
  | {
      success: false;
      error: 'username_taken' | 'invalid_input' | 'not_found' | 'unknown';
    };

/**
 * Update a user's profile (display name, avatar color, username).
 * Validates username uniqueness before updating.
 */
export async function updateUserProfile(
  userId: string,
  input: UpdateUserProfile,
): Promise<UpdateUserProfileResult> {
  try {
    // Validate input
    const validated = parse(UpdateUserProfileSchema, input);

    // Check username uniqueness if username is being changed
    if (validated.username) {
      const availability = await checkUsernameAvailability(
        validated.username,
        userId,
      );
      if (!availability.available) {
        return { success: false, error: 'username_taken' };
      }
    }

    // Build update object — only include fields that are provided
    const updateData: Partial<{
      displayName: string;
      avatarColorCode: string;
      username: string;
      updatedAt: Date;
    }> = {
      updatedAt: new Date(),
    };

    updateData.displayName = validated.displayName;

    if (validated.avatarColorCode !== undefined) {
      updateData.avatarColorCode = validated.avatarColorCode;
    }

    if (validated.username !== undefined) {
      updateData.username = validated.username;
    }

    const result = await db
      .update(userProfiles)
      .set(updateData)
      .where(eq(userProfiles.id, userId))
      .returning();

    const row = result[0];
    if (!row) {
      return { success: false, error: 'not_found' };
    }

    const remote = parse(RemoteUserProfileSchema, {
      id: row.id,
      username: row.username,
      display_name: row.displayName,
      avatar_color_code: row.avatarColorCode,
      locale: row.locale,
      created_at: row.createdAt?.toISOString(),
      updated_at: row.updatedAt?.toISOString(),
    });

    return {
      success: true,
      profile: transformRemoteUserProfile(remote),
    };
  } catch (error) {
    console.error('[updateUserProfile] Error:', error);
    return { success: false, error: 'unknown' };
  }
}
