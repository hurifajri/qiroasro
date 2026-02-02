import { createEnv } from '@t3-oss/env-nextjs';
import { minLength, pipe, string, url } from 'valibot';

export const env = createEnv({
  server: {
    DATABASE_URL: pipe(string(), minLength(1)),
    RESEND_API_KEY: pipe(string(), minLength(1)),
  },
  client: {
    NEXT_PUBLIC_APP_NAME: pipe(string(), minLength(1)),
    NEXT_PUBLIC_APP_URL: pipe(string(), url(), minLength(1)),
    NEXT_PUBLIC_NOREPLY_EMAIL: pipe(string(), minLength(1)),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_NOREPLY_EMAIL: process.env.NEXT_PUBLIC_NOREPLY_EMAIL,
  },
});
