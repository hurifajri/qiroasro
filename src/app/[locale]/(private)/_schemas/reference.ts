import type { InferOutput } from 'valibot';
import {
  array,
  integer,
  nullable,
  number,
  object,
  picklist,
  pipe,
  record,
  string,
  unknown,
} from 'valibot';

export const RULE_CATEGORIES = [
  'nun_sukun_tanwin',
  'mim_sukun',
  'nun_mim_musyaddadatain',
  'madd_letters',
  'lam_tarif',
  'lam_sakinah',
  'ro_condition',
  'lafzul_jalalah',
  'letter_relations',
  'qalqalah',
  'waqf_ibtida',
  'rasm_utsmani',
  'hamzat_wasl',
  'hamzat_qata',
  'istiadah_basmalah',
  'itmamul_harakat',
  'iltiqaus_sakinain',
  'nabr',
  'alifat_sabah',
  'kalimat_khashshah',
  'saktah',
  'dhabth_mushaf',
  'other',
] as const;

export type RuleCategory = (typeof RULE_CATEGORIES)[number];

export type LetterStatus = 'locked' | 'available' | 'learned';

export type LetterTafkhimType =
  'always_tafkhim' | 'conditional' | 'always_tarqiq';

// =====================================================================
// MATERIALIZED VIEW SCHEMAS (mv_tajwid_reference camelCase JSONB)
// =====================================================================

export const ReferenceVerseSchema = object({
  verseNumber: pipe(number(), integer()),
  arabicText: string(),
});

export type ReferenceVerse = InferOutput<typeof ReferenceVerseSchema>;

export const TajwidCitationSchema = object({
  id: pipe(number(), integer()),
  ruleId: pipe(number(), integer()),
  sourceSlug: string(),
  verseStart: pipe(number(), integer()),
  verseEnd: nullable(pipe(number(), integer())),
  verses: array(ReferenceVerseSchema),
});

export type TajwidCitation = InferOutput<typeof TajwidCitationSchema>;

export const TajwidExampleSchema = object({
  id: pipe(number(), integer()),
  slug: string(),
  ruleId: pipe(number(), integer()),
  letterId: nullable(pipe(number(), integer())),
  surahNumber: pipe(number(), integer()),
  ayahNumber: pipe(number(), integer()),
  arabicText: string(),
  highlightText: string(),
  audioUrl: nullable(string()),
  sortOrder: pipe(number(), integer()),
});

export type TajwidExample = InferOutput<typeof TajwidExampleSchema>;

export const TajwidRuleDefinitionSchema = object({
  id: pipe(number(), integer()),
  ruleId: pipe(number(), integer()),
  triggerCategory: picklist(RULE_CATEGORIES),
  sourceLetterId: nullable(pipe(number(), integer())),
  meetingLetterId: nullable(pipe(number(), integer())),
  conditionMetadata: nullable(record(string(), unknown())),
});

export type TajwidRuleDefinition = InferOutput<
  typeof TajwidRuleDefinitionSchema
>;

export const TajwidRuleSchema = object({
  id: pipe(number(), integer()),
  slug: string(),
  parentRuleSlug: nullable(string()),
  category: picklist(RULE_CATEGORIES),
  sortOrder: pipe(number(), integer()),
});

export type TajwidRule = InferOutput<typeof TajwidRuleSchema>;

export const TajwidReferenceDataSchema = object({
  rules: array(TajwidRuleSchema),
  definitions: array(TajwidRuleDefinitionSchema),
  examples: array(TajwidExampleSchema),
  citations: array(TajwidCitationSchema),
});

export type TajwidReferenceData = InferOutput<typeof TajwidReferenceDataSchema>;

// =====================================================================
// TOPIC & LETTERS DIRECTORY DOMAIN TYPES
// =====================================================================

export interface CitationEntry {
  id: number;
  sourceSlug: string;
  verseStart: number;
  verseEnd: number | null;
  verses: ReferenceVerse[];
}

export interface TopicReferenceSection {
  slug: string;
  category: RuleCategory;
  examples: TajwidExample[];
  citations: CitationEntry[];
  definitionsCount: number;
}

export interface Letter {
  id: string;
  letterSlug: string;
  symbol: string;
  nameKey: string;
  makhraj: string;
  status: LetterStatus;
  pointSlug: string;
  tafkhimType: LetterTafkhimType;
  traitSlugs: string[];
  examples: TajwidExample[];
  citations: CitationEntry[];
}

export interface ArticulationGroup {
  id: string;
  titleKey: string;
  letters: Letter[];
}

export interface LettersDirectoryData {
  groups: ArticulationGroup[];
  total: number;
  learned: number;
  available: number;
  locked: number;
}
