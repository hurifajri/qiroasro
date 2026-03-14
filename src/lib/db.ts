import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as authSchema from '@/db/auth-schema';
import * as masterSchema from '@/db/master-schema';
import * as playgroundSchema from '@/db/playground-schema';
import * as userSchema from '@/db/user-schema';
import { env } from '@/env';

/**
 * Cache the database connection in development.
 * This avoids creating a new connection on every HMR update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);

if (process.env.NODE_ENV !== 'production') globalForDb.conn = conn;

export const db = drizzle(conn, {
  schema: {
    ...authSchema,
    ...masterSchema,
    ...playgroundSchema,
    ...userSchema,
  },
});
