import type { InferOutput } from 'valibot';
import {
  array,
  boolean,
  minLength,
  number,
  object,
  optional,
  picklist,
  pipe,
  string,
  union,
} from 'valibot';

import type { userMistakeItems, userSavedItems } from '@/db/curriculum-schema';

export const PRACTICE_TARGET_TYPES = [
  'letter',
  'point',
  'trait',
  'rule',
  'example',
  'verse',
  'question',
] as const;

export type PracticeTargetType = (typeof PRACTICE_TARGET_TYPES)[number];

// =====================================================================
// UNTRUSTED / UNKNOWN BOUNDARY SCHEMAS (JSONB & Mutation Inputs)
// =====================================================================

export const CurQuestionOptionSchema = object({
  id: string(),
  textKey: string(),
});

export const CurQuestionPairSchema = object({
  leftKey: optional(string()),
  rightKey: optional(string()),
  left: optional(string()),
  right: optional(string()),
});

export const CurQuestionDataSchema = object({
  promptKey: string(),
  options: optional(union([array(CurQuestionOptionSchema), array(string())])),
  correctOptionId: optional(string()),
  explanationKey: optional(string()),
  correctBoolean: optional(boolean()),
  missingWord: optional(string()),
  choices: optional(array(string())),
  pairs: optional(array(CurQuestionPairSchema)),
  correctHighlight: optional(string()),
  tokens: optional(array(string())),
  correctToken: optional(string()),
  arabicFocus: optional(string()),
  expectedHarakat: optional(number()),
  arabicTarget: optional(string()),
  correctOption: optional(string()),
});

export type CurQuestionData = InferOutput<typeof CurQuestionDataSchema>;

export const RecordPracticeAttemptInputSchema = object({
  targetType: picklist(PRACTICE_TARGET_TYPES),
  targetSlug: pipe(string(), minLength(1)),
  isCorrect: boolean(),
});

export type RecordPracticeAttemptInput = InferOutput<
  typeof RecordPracticeAttemptInputSchema
>;

export const ToggleSavedItemInputSchema = object({
  targetType: picklist(PRACTICE_TARGET_TYPES),
  targetSlug: pipe(string(), minLength(1)),
});

export type ToggleSavedItemInput = InferOutput<
  typeof ToggleSavedItemInputSchema
>;

// =====================================================================
// DOMAIN TYPES (Drizzle $inferSelect & Plain TypeScript)
// =====================================================================

export type UserMistakeItem = typeof userMistakeItems.$inferSelect;
export type UserSavedItem = typeof userSavedItems.$inferSelect;

export interface AdaptivePracticeItem {
  targetType: PracticeTargetType;
  targetSlug: string;
  title: string;
  subtitle: string;
  arabicText?: string;
  mistakeCount: number;
  isSaved: boolean;
  priorityReason: string;
}

export interface QuizSessionChoice {
  id: string;
  labelKey?: string;
  labelText?: string;
  isCorrect: boolean;
}

export interface QuizSessionQuestion {
  slug: string;
  questionType: string;
  difficulty: number;
  promptKey?: string;
  promptText?: string;
  arabicFocus?: string;
  choices: QuizSessionChoice[];
  isSaved: boolean;
}

export type PracticeColorCode =
  'rose' | 'emerald' | 'amber' | 'sky' | 'purple' | 'orange';

export interface PracticeMode {
  id: string;
  titleKey: string;
  descriptionKey: string;
  iconName: string;
  href: string;
  isPremium?: boolean;
  badge?: number;
  colorCode: PracticeColorCode;
  targetType: PracticeTargetType;
}

export interface PracticeSection {
  id: string;
  titleKey: string;
  modes: PracticeMode[];
}
