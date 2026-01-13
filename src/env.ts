import { createEnv } from '@t3-oss/env-core';
import { minLength, optional, pipe, string, url } from 'valibot';

export const env = createEnv({
  server: {
    RESEND_API_KEY: pipe(string(), minLength(1)),
  },
  clientPrefix: 'NEXT_PUBLIC_',
  client: {
    NEXT_PUBLIC_APP_NAME: pipe(string(), minLength(1)),
    NEXT_PUBLIC_APP_URL: pipe(string(), url(), minLength(1)),
    NEXT_PUBLIC_NOREPLY_EMAIL: pipe(string(), minLength(1)),
    NEXT_PUBLIC_SUPABASE_URL: pipe(string(), minLength(1)),
    NEXT_PUBLIC_SUPABASE_KEY: pipe(string(), minLength(1)),
    // Analytics (optional)
    NEXT_PUBLIC_POSTHOG_KEY: optional(string()),
    NEXT_PUBLIC_POSTHOG_HOST: optional(string()),
  },
  runtimeEnv: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_NOREPLY_EMAIL: process.env.NEXT_PUBLIC_NOREPLY_EMAIL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY,
    // Analytics
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
});
