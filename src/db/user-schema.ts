import { relations, sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { user } from './auth-schema';

// =====================================================================
// USER PROFILES — Private-app user data
// Separate from Better Auth's `user` table which manages identity.
// This table stores app-specific profile data and follow graph.
// =====================================================================

export const userProfiles = pgTable(
  'user_profiles',
  {
    id: text('id')
      .primaryKey()
      .references(() => user.id, { onDelete: 'cascade' }),
    username: text('username').notNull().unique(),
    displayName: text('display_name').notNull(),
    email: text('email').notNull().unique(),
    avatarColorCode: text('avatar_color_code').notNull(),
    locale: text('locale').notNull(),
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

export const userFollows = pgTable(
  'user_follows',
  {
    followerId: text('follower_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    followingId: text('following_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.followerId, table.followingId] }),
    index('idx_user_follows_following').on(table.followingId),
    check(
      'chk_user_follows_no_self',
      sql`${table.followerId} <> ${table.followingId}`,
    ),
  ],
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

export const userFollowsRelations = relations(userFollows, ({ one }) => ({
  follower: one(user, {
    fields: [userFollows.followerId],
    references: [user.id],
    relationName: 'following',
  }),
  following: one(user, {
    fields: [userFollows.followingId],
    references: [user.id],
    relationName: 'followers',
  }),
}));
