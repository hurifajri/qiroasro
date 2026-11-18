import { relations, sql } from 'drizzle-orm';
import {
  type AnyPgColumn,
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

const KEBAB_SLUG_REGEX = '^[a-z0-9]+(-[a-z0-9]+)*$';

function kebabCheck(name: string, column: AnyPgColumn) {
  return check(name, sql`${column} ~ ${sql.raw(`'${KEBAB_SLUG_REGEX}'`)}`);
}

function positiveCheck(name: string, column: AnyPgColumn) {
  return check(name, sql`${column} > 0`);
}

// =====================================================================
// MASTER DATA — LETTERS (HIJ_LETTERS)
// =====================================================================

export const letterTafkhimTypeEnum = pgEnum('letter_tafkhim_type', [
  'always_tafkhim',
  'conditional',
  'always_tarqiq',
]);

export const hijLetters = pgTable(
  'hij_letters',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    slug: text('slug').notNull().unique(),
    parentLetterSlug: text('parent_letter_slug').references(
      (): AnyPgColumn => hijLetters.slug,
      { onUpdate: 'cascade', onDelete: 'cascade' },
    ),
    symbol: text('symbol').notNull(),
    tafkhimType: letterTafkhimTypeEnum('tafkhim_type')
      .notNull()
      .default('always_tarqiq'),
    isMadd: boolean('is_madd').notNull().default(false),
    sortOrder: integer('sort_order').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('idx_hij_letters_parent').on(table.parentLetterSlug),
    index('idx_hij_letters_tafkhim_type').on(table.tafkhimType),
    index('idx_hij_letters_is_madd').on(table.isMadd),
    index('idx_hij_letters_sort_order').on(table.sortOrder),
    index('idx_hij_letters_madd_sort').on(table.isMadd, table.sortOrder),
    kebabCheck('chk_hij_letters_slug_kebab', table.slug),
    check(
      'chk_hij_letters_symbol_nonempty',
      sql`length(btrim(${table.symbol})) > 0`,
    ),
    positiveCheck('chk_hij_letters_sort_positive', table.sortOrder),
    check(
      'chk_hij_letters_no_self_parent',
      sql`${table.parentLetterSlug} IS NULL OR ${table.parentLetterSlug} <> ${table.slug}`,
    ),
  ],
);

// =====================================================================
// MASTER DATA — ARTICULATIONS (MAKHRAJ)
// =====================================================================

export const hijArticulationAreas = pgTable(
  'hij_articulation_areas',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    slug: text('slug').notNull().unique(),
    isMuhaqqaq: boolean('is_muhaqqaq').notNull().default(true),
    sortOrder: integer('sort_order').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    kebabCheck('chk_hij_art_areas_slug_kebab', table.slug),
    positiveCheck('chk_hij_art_areas_sort_positive', table.sortOrder),
  ],
);

export const hijArticulationPoints = pgTable(
  'hij_articulation_points',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    areaId: integer('area_id')
      .notNull()
      .references(() => hijArticulationAreas.id, { onDelete: 'restrict' }),
    slug: text('slug').notNull().unique(),
    sortOrder: integer('sort_order').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('idx_hij_articulation_points_area').on(table.areaId),
    kebabCheck('chk_hij_art_points_slug_kebab', table.slug),
    positiveCheck('chk_hij_art_points_sort_positive', table.sortOrder),
  ],
);

export const hijLetterArticulations = pgTable(
  'hij_letter_articulations',
  {
    letterId: integer('letter_id')
      .notNull()
      .references(() => hijLetters.id, { onDelete: 'restrict' }),
    pointId: integer('point_id')
      .notNull()
      .references(() => hijArticulationPoints.id, { onDelete: 'restrict' }),
    isPrimary: boolean('is_primary').notNull().default(true),
    sortOrder: integer('sort_order').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.letterId, table.pointId] }),
    index('idx_hij_letter_articulations_point').on(table.pointId),
    index('idx_hij_letter_articulations_primary').on(
      table.letterId,
      table.isPrimary,
    ),
    positiveCheck('chk_hij_letter_art_sort_positive', table.sortOrder),
  ],
);

// =====================================================================
// MASTER DATA — TRAITS (SIFAT)
// =====================================================================

export const hijTraitGroups = pgTable(
  'hij_trait_groups',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    slug: text('slug').notNull().unique(),
    isLazimah: boolean('is_lazimah').notNull().default(true),
    hasMiddleTrait: boolean('has_middle_trait').notNull().default(false),
    sortOrder: integer('sort_order').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('idx_hij_trait_groups_lazimah').on(table.isLazimah),
    kebabCheck('chk_hij_trait_groups_slug_kebab', table.slug),
    positiveCheck('chk_hij_trait_groups_sort_positive', table.sortOrder),
  ],
);

export const hijTraits = pgTable(
  'hij_traits',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    groupId: integer('group_id')
      .notNull()
      .references(() => hijTraitGroups.id, { onDelete: 'restrict' }),
    slug: text('slug').notNull().unique(),
    isMiddleTrait: boolean('is_middle_trait').notNull().default(false),
    sortOrder: integer('sort_order').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('idx_hij_traits_group').on(table.groupId),
    index('idx_hij_traits_group_sort').on(table.groupId, table.sortOrder),
    kebabCheck('chk_hij_traits_slug_kebab', table.slug),
    positiveCheck('chk_hij_traits_sort_positive', table.sortOrder),
  ],
);

export const hijLetterTraits = pgTable(
  'hij_letter_traits',
  {
    letterId: integer('letter_id')
      .notNull()
      .references(() => hijLetters.id, { onDelete: 'cascade' }),
    traitId: integer('trait_id')
      .notNull()
      .references(() => hijTraits.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.letterId, table.traitId] }),
    index('idx_hij_letter_traits_trait').on(table.traitId),
  ],
);

// =====================================================================
// RELATIONS
// =====================================================================

export const hijLettersRelations = relations(hijLetters, ({ one, many }) => ({
  parentLetter: one(hijLetters, {
    fields: [hijLetters.parentLetterSlug],
    references: [hijLetters.slug],
    relationName: 'letter_hierarchy',
  }),
  childVariants: many(hijLetters, {
    relationName: 'letter_hierarchy',
  }),
  articulations: many(hijLetterArticulations),
  traits: many(hijLetterTraits),
}));

export const hijArticulationAreasRelations = relations(
  hijArticulationAreas,
  ({ many }) => ({
    points: many(hijArticulationPoints),
  }),
);

export const hijArticulationPointsRelations = relations(
  hijArticulationPoints,
  ({ one, many }) => ({
    area: one(hijArticulationAreas, {
      fields: [hijArticulationPoints.areaId],
      references: [hijArticulationAreas.id],
    }),
    letterArticulations: many(hijLetterArticulations),
  }),
);

export const hijLetterArticulationsRelations = relations(
  hijLetterArticulations,
  ({ one }) => ({
    letter: one(hijLetters, {
      fields: [hijLetterArticulations.letterId],
      references: [hijLetters.id],
    }),
    point: one(hijArticulationPoints, {
      fields: [hijLetterArticulations.pointId],
      references: [hijArticulationPoints.id],
    }),
  }),
);

export const hijTraitGroupsRelations = relations(
  hijTraitGroups,
  ({ many }) => ({
    traits: many(hijTraits),
  }),
);

export const hijTraitsRelations = relations(hijTraits, ({ one, many }) => ({
  group: one(hijTraitGroups, {
    fields: [hijTraits.groupId],
    references: [hijTraitGroups.id],
  }),
  letterTraits: many(hijLetterTraits),
}));

export const hijLetterTraitsRelations = relations(
  hijLetterTraits,
  ({ one }) => ({
    letter: one(hijLetters, {
      fields: [hijLetterTraits.letterId],
      references: [hijLetters.id],
    }),
    trait: one(hijTraits, {
      fields: [hijLetterTraits.traitId],
      references: [hijTraits.id],
    }),
  }),
);
