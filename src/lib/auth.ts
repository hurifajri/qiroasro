import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { userProfiles } from '@/db/user-schema';
import { env } from '@/env';
import { routing } from '@/i18n/routing';
import { DEFAULT_AVATAR_COLOR_CODE } from '@/lib/avatar';
import { db } from '@/lib/db';

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
          // Auto-create a user profile after every new signup
          await db.insert(userProfiles).values({
            id: user.id,
            username: user.id, // temporary unique username — user can update later
            displayName: user.name,
            avatarColorCode: DEFAULT_AVATAR_COLOR_CODE,
            locale: routing.defaultLocale,
          });
        },
      },
    },
  },
});
