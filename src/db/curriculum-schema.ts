import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  check,
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

/**
 * User progress tables for the curriculum learning flow.
 *
 * Progress is tracked at three granularities:
 *   section (topic) → unit → lesson
 * Plus Spaced Repetition mistake tracking and bookmarked items for /practice/*.
 *
 * All slugs are kebab-case strings matching CURRICULUM_TOPICS / master definitions.
 */

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const practiceTargetTypeEnum = pgEnum('practice_target_type', [
  'letter',
  'point',
  'trait',
  'rule',
  'example',
  'verse',
  'question',
]);

/** Tracks whether a user has started / completed a section (topic). */
export const userSectionProgress = pgTable(
  'user_section_progress',
  {
    userId: text('user_id').notNull(),
    /** Matches CurriculumTopic.slug, e.g. 'noble-quran' */
    topicSlug: text('topic_slug').notNull(),
    isCompleted: boolean('is_completed').notNull().default(false),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.topicSlug] }),
    index('usp_user_id_idx').on(table.userId),
  ],
);

/** Tracks whether a user has started / completed a unit within a section. */
export const userUnitProgress = pgTable(
  'user_unit_progress',
  {
    userId: text('user_id').notNull(),
    topicSlug: text('topic_slug').notNull(),
    /** Matches CurriculumUnit.slug, e.g. 'quran-delivery-method' */
    unitSlug: text('unit_slug').notNull(),
    isCompleted: boolean('is_completed').notNull().default(false),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.topicSlug, table.unitSlug],
    }),
    index('uup_user_topic_idx').on(table.userId, table.topicSlug),
  ],
);

/**
 * Tracks per-lesson progress within a unit.
 * lessonOrder is 0-indexed, matching the position in CurriculumUnit.lessons[].
 */
export const userLessonProgress = pgTable(
  'user_lesson_progress',
  {
    userId: text('user_id').notNull(),
    topicSlug: text('topic_slug').notNull(),
    unitSlug: text('unit_slug').notNull(),
    /** 0-indexed position in unit.lessons[] */
    lessonOrder: smallint('lesson_order').notNull(),
    isCompleted: boolean('is_completed').notNull().default(false),
    /** Score achieved (0-100), null until first attempt */
    score: integer('score'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    primaryKey({
      name: 'ulp_pk',
      columns: [
        table.userId,
        table.topicSlug,
        table.unitSlug,
        table.lessonOrder,
      ],
    }),
    index('ulp_user_unit_idx').on(
      table.userId,
      table.topicSlug,
      table.unitSlug,
    ),
  ],
);

/**
 * Tracks per-user Spaced Repetition (SM-2) review items recorded from mistakes
 * in lessons and practice sessions, powering /practice/mistakes.
 */
export const userMistakeItems = pgTable(
  'user_mistake_items',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    targetType: practiceTargetTypeEnum('target_type').notNull(),
    /** Stable kebab-case slug referencing letter/point/trait/rule/example/verse/question */
    targetSlug: text('target_slug').notNull(),
    mistakeCount: integer('mistake_count').notNull().default(1),
    consecutiveCorrect: smallint('consecutive_correct').notNull().default(0),
    /** SM-2 ease factor in permille (2500 = 2.50x) */
    easeFactor: integer('ease_factor').notNull().default(2500),
    intervalDays: smallint('interval_days').notNull().default(1),
    lastMistakeAt: timestamp('last_mistake_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    nextReviewAt: timestamp('next_review_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    isResolved: boolean('is_resolved').notNull().default(false),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    unique('uq_user_mistake_target').on(
      table.userId,
      table.targetType,
      table.targetSlug,
    ),
    index('idx_user_mistake_review_queue').on(
      table.userId,
      table.isResolved,
      table.nextReviewAt,
    ),
    check(
      'chk_umi_slug_kebab',
      sql`${table.targetSlug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`,
    ),
    check('chk_umi_mistake_count', sql`${table.mistakeCount} >= 1`),
    check('chk_umi_consecutive_nonneg', sql`${table.consecutiveCorrect} >= 0`),
    check('chk_umi_ease_floor', sql`${table.easeFactor} >= 1300`),
    check('chk_umi_interval_pos', sql`${table.intervalDays} >= 1`),
  ],
);

/** Tracks user-bookmarked items for /practice/saved. */
export const userSavedItems = pgTable(
  'user_saved_items',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    targetType: practiceTargetTypeEnum('target_type').notNull(),
    targetSlug: text('target_slug').notNull(),
    ...timestamps,
  },
  (table) => [
    unique('uq_user_saved_target').on(
      table.userId,
      table.targetType,
      table.targetSlug,
    ),
    index('idx_user_saved_type').on(table.userId, table.targetType),
    check(
      'chk_usi_slug_kebab',
      sql`${table.targetSlug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`,
    ),
  ],
);

export const userMistakeItemsRelations = relations(
  userMistakeItems,
  ({ one }) => ({
    user: one(user, {
      fields: [userMistakeItems.userId],
      references: [user.id],
    }),
  }),
);

export const userSavedItemsRelations = relations(userSavedItems, ({ one }) => ({
  user: one(user, {
    fields: [userSavedItems.userId],
    references: [user.id],
  }),
}));
