import type { InferOutput } from 'valibot';
import {
  array,
  date,
  integer,
  nullable,
  number,
  object,
  picklist,
  pipe,
  string,
} from 'valibot';

export const XP_SOURCE_TYPES = [
  'lesson',
  'practice',
  'quest',
  'mistake_review',
  'league_bonus',
] as const;

export const XpLedgerEntrySchema = object({
  id: pipe(number(), integer()),
  userId: string(),
  sourceType: picklist(XP_SOURCE_TYPES),
  sourceRef: string(),
  xpAmount: pipe(number(), integer()),
  accuracyScore: nullable(pipe(number(), integer())),
  timeSpentSec: nullable(pipe(number(), integer())),
  createdAt: date(),
});

export type XpLedgerEntry = InferOutput<typeof XpLedgerEntrySchema>;
export const XpLedgerListSchema = array(XpLedgerEntrySchema);
