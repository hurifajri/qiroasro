import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Load env files in priority order (Next.js convention):
// .env.local > .env.development/.env.production > .env
config({ path: '.env.local' });
config({ path: '.env.development' });
config({ path: '.env.production' });
config({ path: '.env' });

// Use DATABASE_URL_DIRECT (session pooler, port 5432) for drizzle-kit.
// DATABASE_URL (transaction pooler, port 6543) causes drizzle-kit to crash
// during schema introspection. Direct/session pooler URL avoids this.
const DATABASE_URL =
  process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL;
if (!DATABASE_URL)
  throw new Error('DATABASE_URL_DIRECT (or DATABASE_URL) is not set');

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
