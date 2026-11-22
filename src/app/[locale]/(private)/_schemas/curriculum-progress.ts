import type { InferOutput } from 'valibot';
import {
  array,
  boolean,
  nullable,
  number,
  object,
  picklist,
  string,
} from 'valibot';

import { CARD_COLOR_CODES } from '@/lib/colors';

// ─── Status ──────────────────────────────────────────────────────────────────

const COURSE_STATUSES = [
  'completed',
  'in-progress',
  'available',
  'locked',
] as const;

export type CourseStatus = (typeof COURSE_STATUSES)[number];

// ─── Progress schemas ─────────────────────────────────────────────────────────

/**
 * Represents DB progress for a single unit within a topic.
 * Returned by getUserUnitProgress service.
 */
export const UnitProgressSchema = object({
  topicSlug: string(),
  unitSlug: string(),
  isCompleted: boolean(),
});

export type UnitProgress = InferOutput<typeof UnitProgressSchema>;

/**
 * Represents DB progress for a single topic/section.
 * Returned by getUserSectionProgress service.
 */
export const SectionProgressSchema = object({
  topicSlug: string(),
  isCompleted: boolean(),
});

export type SectionProgress = InferOutput<typeof SectionProgressSchema>;

/**
 * Represents DB progress for a single lesson.
 */
export const LessonProgressSchema = object({
  topicSlug: string(),
  unitSlug: string(),
  lessonOrder: number(),
  isCompleted: boolean(),
  score: nullable(number()),
});

export type LessonProgress = InferOutput<typeof LessonProgressSchema>;

// ─── Aggregated view schemas ──────────────────────────────────────────────────

/**
 * Aggregated view: all progress for a user across all sections.
 * Derived from CURRICULUM_TOPICS + DB rows.
 */
export const SectionWithProgressSchema = object({
  /** Matches CURRICULUM_TOPICS[n].slug */
  slug: string(),
  sortOrder: number(),
  titleKey: string(),
  descriptionKey: string(),
  iconSymbol: string(),
  totalUnits: number(),
  completedUnits: number(),
  /** 0–100 */
  progress: number(),
  /** Derived from progress + unit progress data */
  status: picklist(COURSE_STATUSES),
});

export type SectionWithProgress = InferOutput<typeof SectionWithProgressSchema>;

/**
 * Aggregated view: all units for a topic with completion status.
 */
export const UnitWithProgressSchema = object({
  slug: string(),
  sortOrder: number(),
  titleKey: string(),
  descriptionKey: string(),
  colorCode: picklist(CARD_COLOR_CODES),
  iconKey: string(),
  isCompleted: boolean(),
  /** 0-based lessons completed count */
  completedLessons: number(),
  totalLessons: number(),
});

export type UnitWithProgress = InferOutput<typeof UnitWithProgressSchema>;

export const UnitProgressListSchema = array(UnitWithProgressSchema);
export const SectionProgressListSchema = array(SectionWithProgressSchema);
