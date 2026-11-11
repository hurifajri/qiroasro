import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

/**
 * User progress tables for the curriculum learning flow.
 *
 * Progress is tracked at three granularities:
 *   section (topic) → unit → lesson
 *
 * All slugs are kebab-case strings matching CURRICULUM_TOPICS definitions.
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
