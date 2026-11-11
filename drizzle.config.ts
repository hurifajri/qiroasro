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
const DATABASE_URL = process.env.DATABASE_URL_DIRECT;
if (!DATABASE_URL) throw new Error('DATABASE_URL_DIRECT is not set');

export default defineConfig({
  out: './drizzle',
  schema: [
    './src/db/auth-schema.ts',
    './src/db/curriculum-schema.ts',
    './src/db/master-schema.ts',
    './src/db/playground-schema.ts',
    './src/db/user-schema.ts',
  ],
  dialect: 'postgresql',
  dbCredentials: { url: DATABASE_URL },
});
