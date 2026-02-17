import type { InferOutput } from 'valibot';
import {
  integer,
  number,
  object,
  optional,
  picklist,
  pipe,
  string,
} from 'valibot';

// Lesson status
export const LESSON_STATUSES = [
  'locked',
  'available',
  'in-progress',
  'completed',
] as const;

// Lesson types
export const LESSON_TYPES = [
  'lesson', // Regular lesson
  'practice', // Practice/review
  'chest', // Treasure chest (milestone)
  'trophy', // Trophy/achievement
] as const;

// Unit Schema
export const UnitSchema = object({
  id: pipe(number(), integer()),
  sectionNumber: pipe(number(), integer()),
  unitNumber: pipe(number(), integer()),
  titleKey: string(), // i18n key
  descriptionKey: string(), // i18n key
  colorCode: string(), // Tailwind color class or hex
  iconKey: optional(string()), // Icon identifier
});

export type Unit = InferOutput<typeof UnitSchema>;

// Lesson Schema
export const LessonSchema = object({
  id: pipe(number(), integer()),
  unitId: pipe(number(), integer()),
  order: pipe(number(), integer()),
  type: picklist(LESSON_TYPES),
  status: picklist(LESSON_STATUSES),
  titleKey: optional(string()), // i18n key, optional for some types
  letterSymbol: optional(string()), // Arabic letter if applicable
  xpReward: pipe(number(), integer()),
  crowns: pipe(number(), integer()), // 0-5 crowns based on performance
});

export type Lesson = InferOutput<typeof LessonSchema>;
