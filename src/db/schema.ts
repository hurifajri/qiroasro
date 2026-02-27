import {
  type AnyPgColumn,
  jsonb,
  pgMaterializedView,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// WAITLIST
export const waitlist = pgTable('waitlist', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  verificationToken: uuid('verification_token').defaultRandom(),
  status: text('status', {
    enum: ['pending', 'verified', 'unsubscribed', 'converted'],
  })
    .notNull()
    .default('pending'),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  source: text('source').default('homepage'),
  locale: text('locale').default('id'),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  referralCode: text('referral_code'),
  referredBy: uuid('referred_by').references((): AnyPgColumn => waitlist.id),
  convertedAt: timestamp('converted_at', { withTimezone: true }),
  convertedUserId: uuid('converted_user_id'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// USER PROFILES
// References auth.users(id) from Supabase Auth.
// Auto-created by a DB trigger on new user signup (see docs/schemas/auth.sql).
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  displayName: varchar('display_name', { length: 100 }).notNull(),
  avatarColorCode: varchar('avatar_color_code', { length: 30 })
    .notNull()
    .default('sky'),
  locale: text('locale').notNull().default('id'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// MATERIALIZED VIEW
// Note: defining it as a view for strict typing in Drizzle
export const mvPlaygroundData = pgMaterializedView('mv_playground_data', {
  data: jsonb('data'),
}).existing();
