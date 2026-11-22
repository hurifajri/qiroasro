'use server';

import { eq } from 'drizzle-orm';
import { parse } from 'valibot';

import { userProfiles } from '@/db/user-schema';
import { db } from '@/lib/db';

import {
  type UpdateUserProfile,
  UpdateUserProfileSchema,
  type UserProfile,
  UserProfileSchema,
} from '../_schemas/user-profile';

export async function getUserProfileById(
  id: string,
): Promise<UserProfile | null> {
  try {
    const result = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.id, id))
      .limit(1);

    const remoteUserProfile = result[0];
    const userProfile = parse(UserProfileSchema, remoteUserProfile);

    return userProfile;
  } catch (error) {
    console.error('[getUserProfileById] Error:', error);
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

    const remoteUserProfile = result[0];
    const userProfile = parse(UserProfileSchema, remoteUserProfile);

    return userProfile;
  } catch (error) {
    console.error('[getUserProfileByUsername] Error:', error);
    return null;
  }
}

export type UsernameAvailability =
  { available: true } | { available: false; reason: 'taken' | 'invalid' };

/**
 * Check if a username is available (not taken by another user).
 * id is excluded from the check (the user can keep their own username).
 */
export async function checkUsernameAvailability(
  username: string,
  id: string,
): Promise<UsernameAvailability> {
  try {
    const result = await db
      .select({ id: userProfiles.id })
      .from(userProfiles)
      .where(eq(userProfiles.username, username))
      .limit(1);

    // Username is taken by another user
    const remoteUserProfile = result[0];
    if (remoteUserProfile && remoteUserProfile.id !== id) {
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
      error: 'username_taken' | 'not_found' | 'unknown';
    };

/**
 * Update a user's profile (display name, avatar color, username).
 * Validates username uniqueness before updating.
 */
export async function updateUserProfile(
  id: string,
  input: UpdateUserProfile,
): Promise<UpdateUserProfileResult> {
  try {
    // Validate input
    const validated = parse(UpdateUserProfileSchema, input);

    // Check username uniqueness if username is being changed
    if (validated.username) {
      const availability = await checkUsernameAvailability(
        validated.username,
        id,
      );
      if (!availability.available) {
        return { success: false, error: 'username_taken' };
      }
    }

    const result = await db
      .update(userProfiles)
      .set(validated)
      .where(eq(userProfiles.id, id))
      .returning();

    const remoteUserProfile = result[0];
    if (!remoteUserProfile) {
      return { success: false, error: 'not_found' };
    }

    const userProfile = parse(UserProfileSchema, remoteUserProfile);

    return {
      success: true,
      profile: userProfile,
    };
  } catch (error) {
    console.error('[updateUserProfile] Error:', error);
    return { success: false, error: 'unknown' };
  }
}
