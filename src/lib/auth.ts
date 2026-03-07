import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { eq } from 'drizzle-orm';
import { getLocale } from 'next-intl/server';
import { userProfiles } from '@/db/user-schema';
import { env } from '@/env';
import { DEFAULT_AVATAR_COLOR_CODE } from '@/lib/avatar';
import { db } from '@/lib/db';

// =====================================================================
// USERNAME GENERATION HELPERS
// =====================================================================

/** Converts a display name into a lowercase slug (e.g. "Ahmad Rizal" → "ahmadrizal") */
function slugifyName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/\s+/g, '') // remove spaces entirely
      .replace(/[^a-z0-9]/g, '') // remove non-latin characters
      .slice(0, 20) || 'user' // fallback to 'user' if name is entirely non-Latin
  );
}

/** Returns a random 4-digit numeric suffix (1000–9999) */
function randomSuffix(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Generates a unique username by trying up to 5 slug + random suffix
 * combinations. Falls back to the first 30 chars of userId if all attempts
 * result in collisions (extremely unlikely in practice).
 */
async function generateUniqueUsername(
  userId: string,
  displayName: string,
): Promise<string> {
  const slug = slugifyName(displayName);

  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = `${slug}_${randomSuffix()}`;

    const existing = await db
      .select({ id: userProfiles.id })
      .from(userProfiles)
      .where(eq(userProfiles.username, candidate))
      .limit(1);

    if (!existing[0]) return candidate;
  }

  // Ultimate fallback — userId is always unique
  return userId.slice(0, 30);
}

// =====================================================================
// AUTH CONFIGURATION
// =====================================================================

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  database: drizzleAdapter(db, { provider: 'pg' }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh session if older than 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // cache session cookie for 5 minutes
    },
  },
  rateLimit: {
    enabled: true,
    window: 60, // 60 second window
    max: 100, // max 100 requests per window
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const locale = await getLocale();
          const username = await generateUniqueUsername(user.id, user.name);

          // Auto-create a user profile after every new signup
          await db.insert(userProfiles).values({
            id: user.id,
            username,
            displayName: user.name,
            avatarColorCode: DEFAULT_AVATAR_COLOR_CODE,
            locale,
          });
        },
      },
    },
  },
});
