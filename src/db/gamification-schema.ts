import { relations, sql } from 'drizzle-orm';
import {
  type AnyPgColumn,
  boolean,
  check,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { user } from './auth-schema';

function validLeagueCheck(name: string, column: AnyPgColumn) {
  return check(
    name,
    sql`${column} IN ('peace', 'devotion', 'knowledge', 'sincerity', 'humility', 'patience', 'gratitude', 'righteousness', 'wisdom', 'paradise')`,
  );
}

// =====================================================================
// GAMIFICATION — XP, STREAKS, HEARTS, GEMS, QUESTS, BADGES & LEAGUES
// =====================================================================

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date()),
};

export const xpSourceTypeEnum = pgEnum('xp_source_type', [
  'lesson',
  'practice',
  'quest',
  'mistake_review',
  'league_bonus',
]);

export const promotionStatusEnum = pgEnum('promotion_status', [
  'promoted',
  'stayed',
  'demoted',
]);

export const userGamification = pgTable(
  'user_gamification',
  {
    userId: text('user_id')
      .primaryKey()
      .references(() => user.id, { onDelete: 'cascade' }),
    totalXp: integer('total_xp').notNull().default(0),
    level: smallint('level').notNull().default(1),
    currentStreak: integer('current_streak').notNull().default(0),
    longestStreak: integer('longest_streak').notNull().default(0),
    lastActiveDate: date('last_active_date'),
    streakFreezes: smallint('streak_freezes').notNull().default(0),
    hearts: smallint('hearts').notNull().default(5),
    maxHearts: smallint('max_hearts').notNull().default(5),
    heartsUpdatedAt: timestamp('hearts_updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    gems: integer('gems').notNull().default(0),
    currentLeagueSlug: text('current_league_slug').notNull().default('peace'),
    ...timestamps,
  },
  (table) => [
    index('idx_user_gamification_league').on(
      table.currentLeagueSlug,
      table.totalXp,
    ),
    check('chk_ug_xp_nonneg', sql`${table.totalXp} >= 0`),
    check('chk_ug_level_pos', sql`${table.level} >= 1`),
    check(
      'chk_ug_streak_nonneg',
      sql`${table.currentStreak} >= 0 AND ${table.longestStreak} >= ${table.currentStreak}`,
    ),
    check('chk_ug_freezes_nonneg', sql`${table.streakFreezes} >= 0`),
    check('chk_ug_max_hearts_pos', sql`${table.maxHearts} >= 1`),
    check(
      'chk_ug_hearts_range',
      sql`${table.hearts} BETWEEN 0 AND ${table.maxHearts}`,
    ),
    check('chk_ug_gems_nonneg', sql`${table.gems} >= 0`),
    validLeagueCheck('chk_ug_league_valid', table.currentLeagueSlug),
  ],
);

export const userXpLedger = pgTable(
  'user_xp_ledger',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    sourceType: xpSourceTypeEnum('source_type').notNull(),
    sourceRef: text('source_ref').notNull(),
    xpAmount: integer('xp_amount').notNull(),
    accuracyScore: smallint('accuracy_score'),
    timeSpentSec: integer('time_spent_sec'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('idx_user_xp_ledger_user_date').on(table.userId, table.createdAt),
    check('chk_uxl_xp_nonneg', sql`${table.xpAmount} >= 0`),
    check('chk_uxl_ref_nonempty', sql`length(btrim(${table.sourceRef})) > 0`),
    check(
      'chk_uxl_accuracy_range',
      sql`${table.accuracyScore} IS NULL OR ${table.accuracyScore} BETWEEN 0 AND 100`,
    ),
    check(
      'chk_uxl_time_nonneg',
      sql`${table.timeSpentSec} IS NULL OR ${table.timeSpentSec} >= 0`,
    ),
  ],
);

export const userDailyQuests = pgTable(
  'user_daily_quests',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    questDate: date('quest_date').notNull(),
    questSlug: text('quest_slug').notNull(),
    currentValue: integer('current_value').notNull().default(0),
    targetValue: integer('target_value').notNull(),
    xpReward: smallint('xp_reward').notNull(),
    gemsReward: smallint('gems_reward').notNull().default(0),
    isCompleted: boolean('is_completed').notNull().default(false),
    isClaimed: boolean('is_claimed').notNull().default(false),
    claimedAt: timestamp('claimed_at', { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    unique('uq_user_daily_quests_key').on(
      table.userId,
      table.questDate,
      table.questSlug,
    ),
    index('idx_user_daily_quests_lookup').on(table.userId, table.questDate),
    check(
      'chk_udq_values',
      sql`${table.currentValue} >= 0 AND ${table.targetValue} > 0`,
    ),
    check(
      'chk_udq_rewards',
      sql`${table.xpReward} >= 0 AND ${table.gemsReward} >= 0`,
    ),
    check(
      'chk_udq_claim_requires_complete',
      sql`NOT ${table.isClaimed} OR ${table.isCompleted}`,
    ),
  ],
);

export const userAchievements = pgTable(
  'user_achievements',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    achievementSlug: text('achievement_slug').notNull(),
    currentLevel: smallint('current_level').notNull().default(0),
    currentProgress: integer('current_progress').notNull().default(0),
    unlockedAt: timestamp('unlocked_at', { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.achievementSlug] }),
    check(
      'chk_ua_nonneg',
      sql`${table.currentLevel} >= 0 AND ${table.currentProgress} >= 0`,
    ),
  ],
);

export const userMonthlyBadges = pgTable(
  'user_monthly_badges',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    year: smallint('year').notNull(),
    month: smallint('month').notNull(),
    badgeSlug: text('badge_slug').notNull(),
    currentProgress: integer('current_progress').notNull().default(0),
    targetProgress: integer('target_progress').notNull().default(20),
    isUnlocked: boolean('is_unlocked').notNull().default(false),
    unlockedAt: timestamp('unlocked_at', { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.year, table.month] }),
    check(
      'chk_umb_year_month',
      sql`${table.year} >= 2024 AND ${table.month} BETWEEN 1 AND 12`,
    ),
    check(
      'chk_umb_progress',
      sql`${table.currentProgress} >= 0 AND ${table.targetProgress} > 0`,
    ),
  ],
);

export const leagueCohorts = pgTable(
  'league_cohorts',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    leagueSlug: text('league_slug').notNull(),
    weekStartDate: date('week_start_date').notNull(),
    isProcessed: boolean('is_processed').notNull().default(false),
    ...timestamps,
  },
  (table) => [
    index('idx_league_cohorts_week').on(table.leagueSlug, table.weekStartDate),
    validLeagueCheck('chk_lc_league_valid', table.leagueSlug),
  ],
);

export const leagueParticipants = pgTable(
  'league_participants',
  {
    cohortId: integer('cohort_id')
      .notNull()
      .references(() => leagueCohorts.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    weeklyXp: integer('weekly_xp').notNull().default(0),
    finalRank: smallint('final_rank'),
    promotionStatus: promotionStatusEnum('promotion_status'),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.cohortId, table.userId] }),
    index('idx_league_participants_ranking').on(table.cohortId, table.weeklyXp),
    check('chk_lp_xp_nonneg', sql`${table.weeklyXp} >= 0`),
    check(
      'chk_lp_rank_pos',
      sql`${table.finalRank} IS NULL OR ${table.finalRank} > 0`,
    ),
  ],
);

// =====================================================================
// RELATIONS
// =====================================================================

export const userGamificationRelations = relations(
  userGamification,
  ({ one }) => ({
    user: one(user, {
      fields: [userGamification.userId],
      references: [user.id],
    }),
  }),
);

export const userXpLedgerRelations = relations(userXpLedger, ({ one }) => ({
  user: one(user, {
    fields: [userXpLedger.userId],
    references: [user.id],
  }),
}));

export const userDailyQuestsRelations = relations(
  userDailyQuests,
  ({ one }) => ({
    user: one(user, {
      fields: [userDailyQuests.userId],
      references: [user.id],
    }),
  }),
);

export const userAchievementsRelations = relations(
  userAchievements,
  ({ one }) => ({
    user: one(user, {
      fields: [userAchievements.userId],
      references: [user.id],
    }),
  }),
);

export const userMonthlyBadgesRelations = relations(
  userMonthlyBadges,
  ({ one }) => ({
    user: one(user, {
      fields: [userMonthlyBadges.userId],
      references: [user.id],
    }),
  }),
);

export const leagueCohortsRelations = relations(leagueCohorts, ({ many }) => ({
  participants: many(leagueParticipants),
}));

export const leagueParticipantsRelations = relations(
  leagueParticipants,
  ({ one }) => ({
    cohort: one(leagueCohorts, {
      fields: [leagueParticipants.cohortId],
      references: [leagueCohorts.id],
    }),
    user: one(user, {
      fields: [leagueParticipants.userId],
      references: [user.id],
    }),
  }),
);
