import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { user } from './auth-schema';

// =====================================================================
// USER PROFILES — Private-app user data
// Separate from Better Auth's `user` table which manages identity.
// This table stores app-specific profile data.
// =====================================================================

export const userProfiles = pgTable(
  'user_profiles',
  {
    id: text('id')
      .primaryKey()
      .references(() => user.id, { onDelete: 'cascade' }),
    username: varchar('username', { length: 50 }).notNull().unique(),
    displayName: text('display_name').notNull(),
    avatarColorCode: varchar('avatar_color_code', { length: 10 }).notNull(),
    locale: varchar('locale', { length: 10 }).notNull().default('id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [index('idx_user_profiles_username').on(table.username)],
);

// =====================================================================
// RELATIONS
// =====================================================================

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(user, {
    fields: [userProfiles.id],
    references: [user.id],
  }),
}));
