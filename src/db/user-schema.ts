import { relations } from 'drizzle-orm';
import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
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
    username: text('username').notNull().unique(),
    displayName: text('display_name').notNull(),
    avatarColorCode: text('avatar_color_code').notNull(),
    locale: text('locale').notNull().default('id'),
    followersCount: integer('followers_count').notNull().default(0),
    followingCount: integer('following_count').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
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
