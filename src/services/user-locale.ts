'use server';

import { eq } from 'drizzle-orm';
import { userProfiles } from '@/db/user-schema';
import type { Locale } from '@/i18n/routing';
import { db } from '@/lib/db';

export async function updateUserLocale(
  id: string,
  locale: Locale,
): Promise<{ success: boolean }> {
  try {
    await db
      .update(userProfiles)
      .set({ locale })
      .where(eq(userProfiles.id, id));
    return { success: true };
  } catch (error) {
    console.error('[updateUserLocale] Error:', error);
    return { success: false };
  }
}
