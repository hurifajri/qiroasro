import type { InferOutput } from 'valibot';
import { integer, number, object, picklist, pipe, string } from 'valibot';

// Section status
export const SECTION_STATUSES = [
  'locked',
  'available',
  'in-progress',
  'completed',
] as const;

// Section Schema
export const SectionSchema = object({
  id: pipe(number(), integer()),
  number: pipe(number(), integer()),
  titleKey: string(), // i18n key
  descriptionKey: string(), // i18n key
  progress: pipe(number(), integer()), // 0-100
  status: picklist(SECTION_STATUSES),
  totalUnits: pipe(number(), integer()),
  completedUnits: pipe(number(), integer()),
});

export type Section = InferOutput<typeof SectionSchema>;
