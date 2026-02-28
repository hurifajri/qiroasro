import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from '@/env';

export default defineConfig({
  out: './drizzle',
  schema: [
    './src/db/common-schema.ts',
    './src/db/playground-schema.ts',
    './src/db/auth-schema.ts',
  ],
  dialect: 'postgresql',
  dbCredentials: { url: env.DATABASE_URL },
});
