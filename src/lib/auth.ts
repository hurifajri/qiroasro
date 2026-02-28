import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { env } from '@/env';
import { db } from '@/lib/db';

export const auth = betterAuth({
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
});
