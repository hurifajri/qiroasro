import {
  type AnyPgColumn,
  jsonb,
  pgMaterializedView,
  pgTable,
  text,
  timestamp,
  uuid,
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

// MATERIALIZED VIEW
// Note: defining it as a view for strict typing in Drizzle
export const mvPlaygroundData = pgMaterializedView('mv_playground_data', {
  data: jsonb('data'),
}).existing();
