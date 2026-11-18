import { relations, sql } from 'drizzle-orm';
import {
  type AnyPgColumn,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgMaterializedView,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import {
  hijArticulationPoints,
  hijLetters,
  hijTraits,
} from './hijaiyyah-schema';

function kebabCheck(name: string, column: AnyPgColumn) {
  return check(name, sql`${column} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`);
}

function positiveCheck(name: string, column: AnyPgColumn) {
  return check(name, sql`${column} > 0`);
}

function nonemptyTextCheck(name: string, column: AnyPgColumn) {
  return check(name, sql`length(btrim(${column})) > 0`);
}

function verseCitationChecks(
  prefix: string,
  verseStart: AnyPgColumn,
  verseEnd: AnyPgColumn,
) {
  return [
    positiveCheck(`${prefix}_start_positive`, verseStart),
    check(
      `${prefix}_verse_range`,
      sql`${verseEnd} IS NULL OR ${verseEnd} >= ${verseStart}`,
    ),
  ];
}

// =====================================================================
// ENUMS — TAJWID ENGINE & CURRICULUM BANK
// =====================================================================

export const ruleCategoryEnum = pgEnum('rule_category', [
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
]);

export const questionTypeEnum = pgEnum('question_type', [
  'multiple_choice',
  'true_false',
  'match_pairs',
  'spot_in_ayah',
  'complete_matan',
  'audio_guess',
]);

// =====================================================================
// REFERENCE SOURCES & VERSES
// =====================================================================

export const refSources = pgTable(
  'ref_sources',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    slug: text('slug').notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    createdBy: uuid('created_by'),
    updatedBy: uuid('updated_by'),
  },
  (table) => [kebabCheck('chk_ref_sources_slug_kebab', table.slug)],
);

export const refVerses = pgTable(
  'ref_verses',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    sourceId: integer('source_id')
      .notNull()
      .references(() => refSources.id, { onDelete: 'cascade' }),
    verseNumber: integer('verse_number').notNull(),
    arabicText: text('arabic_text').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    createdBy: uuid('created_by'),
    updatedBy: uuid('updated_by'),
  },
  (table) => [
    index('idx_ref_verses_source_id').on(table.sourceId),
    unique('uq_ref_verses_source_number').on(table.sourceId, table.verseNumber),
    positiveCheck('chk_ref_verses_verse_positive', table.verseNumber),
    nonemptyTextCheck('chk_ref_verses_text_nonempty', table.arabicText),
  ],
);

// =====================================================================
// TAJWID RULES, DEFINITIONS & QURANIC EXAMPLES
// =====================================================================

export const tajRules = pgTable(
  'taj_rules',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    slug: text('slug').notNull().unique(),
    parentRuleSlug: text('parent_rule_slug').references(
      (): AnyPgColumn => tajRules.slug,
      { onUpdate: 'cascade', onDelete: 'set null' },
    ),
    category: ruleCategoryEnum('category').notNull(),
    sortOrder: integer('sort_order').notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    createdBy: uuid('created_by'),
    updatedBy: uuid('updated_by'),
  },
  (table) => [
    index('idx_taj_rules_parent').on(table.parentRuleSlug),
    index('idx_taj_rules_category').on(table.category, table.sortOrder),
    kebabCheck('chk_taj_rules_slug_kebab', table.slug),
    positiveCheck('chk_taj_rules_sort_positive', table.sortOrder),
    check(
      'chk_taj_rules_no_self_parent',
      sql`${table.parentRuleSlug} IS NULL OR ${table.parentRuleSlug} <> ${table.slug}`,
    ),
  ],
);

export const tajRuleDefinitions = pgTable(
  'taj_rule_definitions',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    ruleId: integer('rule_id')
      .notNull()
      .references(() => tajRules.id, { onDelete: 'cascade' }),
    triggerCategory: ruleCategoryEnum('trigger_category').notNull(),
    sourceLetterId: integer('source_letter_id').references(
      () => hijLetters.id,
      { onDelete: 'cascade' },
    ),
    meetingLetterId: integer('meeting_letter_id').references(
      () => hijLetters.id,
      { onDelete: 'cascade' },
    ),
    conditionMetadata:
      jsonb('condition_metadata').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    createdBy: uuid('created_by'),
    updatedBy: uuid('updated_by'),
  },
  (table) => [
    index('idx_taj_rule_definitions_rule').on(table.ruleId),
    index('idx_taj_rule_definitions_source').on(table.sourceLetterId),
    index('idx_taj_rule_definitions_meeting').on(table.meetingLetterId),
    index('idx_taj_rule_definitions_trigger').on(table.triggerCategory),
    index('idx_taj_rule_definitions_metadata').using(
      'gin',
      table.conditionMetadata,
    ),
    unique('uq_taj_rule_definitions_key')
      .on(
        table.ruleId,
        table.triggerCategory,
        table.sourceLetterId,
        table.meetingLetterId,
      )
      .nullsNotDistinct(),
    check(
      'chk_taj_rule_defs_metadata_obj',
      sql`${table.conditionMetadata} IS NULL OR jsonb_typeof(${table.conditionMetadata}) = 'object'`,
    ),
  ],
);

export const tajExamples = pgTable(
  'taj_examples',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    slug: text('slug').notNull().unique(),
    ruleId: integer('rule_id')
      .notNull()
      .references(() => tajRules.id, { onDelete: 'cascade' }),
    letterId: integer('letter_id').references(() => hijLetters.id, {
      onDelete: 'set null',
    }),
    surahNumber: smallint('surah_number').notNull(),
    ayahNumber: smallint('ayah_number').notNull(),
    arabicText: text('arabic_text').notNull(),
    highlightText: text('highlight_text').notNull(),
    audioUrl: text('audio_url'),
    sortOrder: integer('sort_order').notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('idx_taj_examples_rule').on(table.ruleId, table.sortOrder),
    index('idx_taj_examples_letter').on(table.letterId),
    index('idx_taj_examples_surah_ayah').on(
      table.surahNumber,
      table.ayahNumber,
    ),
    kebabCheck('chk_taj_examples_slug_kebab', table.slug),
    check(
      'chk_taj_examples_surah_valid',
      sql`${table.surahNumber} BETWEEN 1 AND 114`,
    ),
    positiveCheck('chk_taj_examples_ayah_positive', table.ayahNumber),
    nonemptyTextCheck('chk_taj_examples_arabic_nonempty', table.arabicText),
    nonemptyTextCheck(
      'chk_taj_examples_highlight_nonempty',
      table.highlightText,
    ),
    positiveCheck('chk_taj_examples_sort_positive', table.sortOrder),
  ],
);

// =====================================================================
// CITATIONS (References linking Rules, Makhraj & Sifat -> ref_sources)
// =====================================================================

export const tajRuleCitations = pgTable(
  'taj_rule_citations',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    ruleId: integer('rule_id')
      .notNull()
      .references(() => tajRules.id, { onDelete: 'cascade' }),
    sourceId: integer('source_id')
      .notNull()
      .references(() => refSources.id, { onDelete: 'cascade' }),
    verseStart: integer('verse_start').notNull(),
    verseEnd: integer('verse_end'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    createdBy: uuid('created_by'),
    updatedBy: uuid('updated_by'),
  },
  (table) => [
    index('idx_taj_rule_citations_rule').on(table.ruleId),
    index('idx_taj_rule_citations_source').on(table.sourceId),
    index('idx_taj_rule_citations_range').on(
      table.sourceId,
      table.verseStart,
      table.verseEnd,
    ),
    unique('uq_taj_rule_citations_key').on(
      table.ruleId,
      table.sourceId,
      table.verseStart,
    ),
    ...verseCitationChecks(
      'chk_taj_rule_cit',
      table.verseStart,
      table.verseEnd,
    ),
  ],
);

export const hijArticulationCitations = pgTable(
  'hij_articulation_citations',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    pointId: integer('point_id')
      .notNull()
      .references(() => hijArticulationPoints.id, { onDelete: 'cascade' }),
    sourceId: integer('source_id')
      .notNull()
      .references(() => refSources.id, { onDelete: 'cascade' }),
    verseStart: integer('verse_start').notNull(),
    verseEnd: integer('verse_end'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    createdBy: uuid('created_by'),
    updatedBy: uuid('updated_by'),
  },
  (table) => [
    index('idx_hij_articulation_citations_point').on(table.pointId),
    index('idx_hij_articulation_citations_source').on(table.sourceId),
    index('idx_hij_articulation_citations_range').on(
      table.sourceId,
      table.verseStart,
      table.verseEnd,
    ),
    unique('uq_hij_art_citations_key').on(
      table.pointId,
      table.sourceId,
      table.verseStart,
    ),
    ...verseCitationChecks('chk_hij_art_cit', table.verseStart, table.verseEnd),
  ],
);

export const hijTraitCitations = pgTable(
  'hij_trait_citations',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    traitId: integer('trait_id')
      .notNull()
      .references(() => hijTraits.id, { onDelete: 'cascade' }),
    sourceId: integer('source_id')
      .notNull()
      .references(() => refSources.id, { onDelete: 'cascade' }),
    verseStart: integer('verse_start').notNull(),
    verseEnd: integer('verse_end'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    createdBy: uuid('created_by'),
    updatedBy: uuid('updated_by'),
  },
  (table) => [
    index('idx_hij_trait_citations_trait').on(table.traitId),
    index('idx_hij_trait_citations_source').on(table.sourceId),
    index('idx_hij_trait_citations_range').on(
      table.sourceId,
      table.verseStart,
      table.verseEnd,
    ),
    unique('uq_hij_trait_citations_key').on(
      table.traitId,
      table.sourceId,
      table.verseStart,
    ),
    ...verseCitationChecks(
      'chk_hij_trait_cit',
      table.verseStart,
      table.verseEnd,
    ),
  ],
);

// =====================================================================
// CURRICULUM AUTHORED QUESTIONS BANK
// =====================================================================

export const curQuestions = pgTable(
  'cur_questions',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    slug: text('slug').notNull().unique(),
    topicSlug: text('topic_slug').notNull(),
    unitSlug: text('unit_slug').notNull(),
    questionType: questionTypeEnum('question_type').notNull(),
    difficulty: smallint('difficulty').notNull().default(1),
    ruleId: integer('rule_id').references(() => tajRules.id, {
      onDelete: 'set null',
    }),
    exampleId: integer('example_id').references(() => tajExamples.id, {
      onDelete: 'set null',
    }),
    verseId: integer('verse_id').references(() => refVerses.id, {
      onDelete: 'set null',
    }),
    questionData: jsonb('question_data')
      .$type<Record<string, unknown>>()
      .notNull(),
    sortOrder: integer('sort_order').notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('idx_cur_questions_unit').on(
      table.topicSlug,
      table.unitSlug,
      table.sortOrder,
    ),
    index('idx_cur_questions_rule').on(table.ruleId),
    index('idx_cur_questions_example').on(table.exampleId),
    index('idx_cur_questions_verse').on(table.verseId),
    index('idx_cur_questions_data').using('gin', table.questionData),
    kebabCheck('chk_cur_questions_slug_kebab', table.slug),
    kebabCheck('chk_cur_questions_topic_kebab', table.topicSlug),
    kebabCheck('chk_cur_questions_unit_kebab', table.unitSlug),
    check(
      'chk_cur_questions_difficulty',
      sql`${table.difficulty} BETWEEN 1 AND 3`,
    ),
    check(
      'chk_cur_questions_data_obj',
      sql`jsonb_typeof(${table.questionData}) = 'object'`,
    ),
    positiveCheck('chk_cur_questions_sort_positive', table.sortOrder),
  ],
);

// =====================================================================
// MATERIALIZED VIEW — TAJWID REFERENCE
// =====================================================================

export const mvTajwidReference = pgMaterializedView('mv_tajwid_reference', {
  id: integer('id'),
  data: jsonb('data'),
}).existing();

// =====================================================================
// RELATIONS
// =====================================================================

export const refSourcesRelations = relations(refSources, ({ many }) => ({
  verses: many(refVerses),
  ruleCitations: many(tajRuleCitations),
  articulationCitations: many(hijArticulationCitations),
  traitCitations: many(hijTraitCitations),
}));

export const refVersesRelations = relations(refVerses, ({ one, many }) => ({
  source: one(refSources, {
    fields: [refVerses.sourceId],
    references: [refSources.id],
  }),
  questions: many(curQuestions),
}));

export const tajRulesRelations = relations(tajRules, ({ one, many }) => ({
  parent: one(tajRules, {
    fields: [tajRules.parentRuleSlug],
    references: [tajRules.slug],
    relationName: 'taj_rule_hierarchy',
  }),
  children: many(tajRules, { relationName: 'taj_rule_hierarchy' }),
  definitions: many(tajRuleDefinitions),
  examples: many(tajExamples),
  citations: many(tajRuleCitations),
  questions: many(curQuestions),
}));

export const tajRuleDefinitionsRelations = relations(
  tajRuleDefinitions,
  ({ one }) => ({
    rule: one(tajRules, {
      fields: [tajRuleDefinitions.ruleId],
      references: [tajRules.id],
    }),
    sourceLetter: one(hijLetters, {
      fields: [tajRuleDefinitions.sourceLetterId],
      references: [hijLetters.id],
      relationName: 'source_letter_definitions',
    }),
    meetingLetter: one(hijLetters, {
      fields: [tajRuleDefinitions.meetingLetterId],
      references: [hijLetters.id],
      relationName: 'meeting_letter_definitions',
    }),
  }),
);

export const tajExamplesRelations = relations(tajExamples, ({ one, many }) => ({
  rule: one(tajRules, {
    fields: [tajExamples.ruleId],
    references: [tajRules.id],
  }),
  letter: one(hijLetters, {
    fields: [tajExamples.letterId],
    references: [hijLetters.id],
  }),
  questions: many(curQuestions),
}));

export const tajRuleCitationsRelations = relations(
  tajRuleCitations,
  ({ one }) => ({
    rule: one(tajRules, {
      fields: [tajRuleCitations.ruleId],
      references: [tajRules.id],
    }),
    source: one(refSources, {
      fields: [tajRuleCitations.sourceId],
      references: [refSources.id],
    }),
  }),
);

export const hijArticulationCitationsRelations = relations(
  hijArticulationCitations,
  ({ one }) => ({
    point: one(hijArticulationPoints, {
      fields: [hijArticulationCitations.pointId],
      references: [hijArticulationPoints.id],
    }),
    source: one(refSources, {
      fields: [hijArticulationCitations.sourceId],
      references: [refSources.id],
    }),
  }),
);

export const hijTraitCitationsRelations = relations(
  hijTraitCitations,
  ({ one }) => ({
    trait: one(hijTraits, {
      fields: [hijTraitCitations.traitId],
      references: [hijTraits.id],
    }),
    source: one(refSources, {
      fields: [hijTraitCitations.sourceId],
      references: [refSources.id],
    }),
  }),
);

export const curQuestionsRelations = relations(curQuestions, ({ one }) => ({
  rule: one(tajRules, {
    fields: [curQuestions.ruleId],
    references: [tajRules.id],
  }),
  example: one(tajExamples, {
    fields: [curQuestions.exampleId],
    references: [tajExamples.id],
  }),
  verse: one(refVerses, {
    fields: [curQuestions.verseId],
    references: [refVerses.id],
  }),
}));
