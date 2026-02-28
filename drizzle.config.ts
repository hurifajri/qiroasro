import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Load env files in priority order (Next.js convention):
// .env.local > .env.development/.env.production > .env
config({ path: '.env.local' });
config({ path: '.env.development' });
config({ path: '.env.production' });
config({ path: '.env' });

// Use process.env directly — @/env uses @t3-oss/env-nextjs which validates
// all env vars at import time and fails outside the Next.js build context
// (e.g. when running drizzle-kit CLI commands).
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
  out: './drizzle',
  schema: [
    './src/db/common-schema.ts',
    './src/db/playground-schema.ts',
    './src/db/auth-schema.ts',
  ],
  dialect: 'postgresql',
  dbCredentials: { url: DATABASE_URL },
});
