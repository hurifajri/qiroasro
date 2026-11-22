-- =====================================================================
-- MATERIALIZED VIEWS (Pre-computed JSONB Read Payloads)
-- =====================================================================
-- Single Source of Truth (DRY):
--   Typed Drizzle proxies live in src/db/playground-schema.ts and
--   src/db/tajwid-schema.ts; actual PostgreSQL view definitions live here.
-- Execution order: Run `pnpm db:push`, then `pnpm db:seed`.

BEGIN;

-- 1. Playground payload consolidating 7 static hij_* queries into 1 row
DROP MATERIALIZED VIEW IF EXISTS mv_playground_data;
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_playground_data AS
SELECT
    1 AS id,
    jsonb_build_object(
        'letters', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', l.id,
                    'slug', l.slug,
                    'parentLetterSlug', l.parent_letter_slug,
                    'symbol', l.symbol,
                    'tafkhimType', l.tafkhim_type,
                    'isMadd', l.is_madd,
                    'sortOrder', l.sort_order
                ) ORDER BY l.sort_order
            ), '[]'::jsonb)
            FROM hij_letters l
        ),
        'articulationAreas', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', aa.id,
                    'slug', aa.slug,
                    'isMuhaqqaq', aa.is_muhaqqaq,
                    'sortOrder', aa.sort_order
                ) ORDER BY aa.sort_order
            ), '[]'::jsonb)
            FROM hij_articulation_areas aa
        ),
        'articulationPoints', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', ap.id,
                    'areaId', ap.area_id,
                    'slug', ap.slug,
                    'sortOrder', ap.sort_order
                ) ORDER BY ap.sort_order
            ), '[]'::jsonb)
            FROM hij_articulation_points ap
        ),
        'traitGroups', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', tg.id,
                    'slug', tg.slug,
                    'isLazimah', tg.is_lazimah,
                    'hasMiddleTrait', tg.has_middle_trait,
                    'sortOrder', tg.sort_order
                ) ORDER BY tg.sort_order
            ), '[]'::jsonb)
            FROM hij_trait_groups tg
        ),
        'traits', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', t.id,
                    'groupId', t.group_id,
                    'slug', t.slug,
                    'isMiddleTrait', t.is_middle_trait,
                    'sortOrder', t.sort_order
                ) ORDER BY t.sort_order
            ), '[]'::jsonb)
            FROM hij_traits t
        ),
        'letterArticulations', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'letterId', la.letter_id,
                    'pointId', la.point_id,
                    'isPrimary', la.is_primary,
                    'sortOrder', la.sort_order
                ) ORDER BY la.sort_order
            ), '[]'::jsonb)
            FROM hij_letter_articulations la
        ),
        'letterTraits', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'letterId', lt.letter_id,
                    'traitId', lt.trait_id
                ) ORDER BY lt.letter_id, lt.trait_id
            ), '[]'::jsonb)
            FROM hij_letter_traits lt
        )
    ) AS data;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_playground_data_id
    ON mv_playground_data (id);

-- 2. Full Tajwid reference payload consolidating rules, definitions, examples & citations
DROP MATERIALIZED VIEW IF EXISTS mv_tajwid_reference;
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_tajwid_reference AS
SELECT
    1 AS id,
    jsonb_build_object(
        'rules', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', r.id,
                    'slug', r.slug,
                    'parentRuleSlug', r.parent_rule_slug,
                    'category', r.category,
                    'sortOrder', r.sort_order
                ) ORDER BY r.sort_order
            ), '[]'::jsonb)
            FROM taj_rules r
        ),
        'definitions', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', d.id,
                    'ruleId', d.rule_id,
                    'triggerCategory', d.trigger_category,
                    'sourceLetterId', d.source_letter_id,
                    'meetingLetterId', d.meeting_letter_id,
                    'conditionMetadata', d.condition_metadata
                ) ORDER BY d.rule_id, d.id
            ), '[]'::jsonb)
            FROM taj_rule_definitions d
        ),
        'examples', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', e.id,
                    'slug', e.slug,
                    'ruleId', e.rule_id,
                    'letterId', e.letter_id,
                    'surahNumber', e.surah_number,
                    'ayahNumber', e.ayah_number,
                    'arabicText', e.arabic_text,
                    'highlightText', e.highlight_text,
                    'audioUrl', e.audio_url,
                    'sortOrder', e.sort_order
                ) ORDER BY e.rule_id, e.sort_order
            ), '[]'::jsonb)
            FROM taj_examples e
        ),
        'citations', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', c.id,
                    'ruleId', c.rule_id,
                    'sourceSlug', s.slug,
                    'verseStart', c.verse_start,
                    'verseEnd', c.verse_end,
                    'verses', (
                        SELECT COALESCE(jsonb_agg(
                            jsonb_build_object(
                                'verseNumber', rv.verse_number,
                                'arabicText', rv.arabic_text
                            ) ORDER BY rv.verse_number
                        ), '[]'::jsonb)
                        FROM ref_verses rv
                        WHERE rv.source_id = c.source_id
                          AND rv.verse_number BETWEEN c.verse_start AND COALESCE(c.verse_end, c.verse_start)
                    )
                ) ORDER BY c.rule_id, s.slug, c.verse_start
            ), '[]'::jsonb)
            FROM taj_rule_citations c
            JOIN ref_sources s ON s.id = c.source_id
        )
    ) AS data;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_tajwid_reference_id
    ON mv_tajwid_reference (id);

COMMIT;

-- Note: Run REFRESH MATERIALIZED VIEW CONCURRENTLY mv_playground_data;
-- and REFRESH MATERIALIZED VIEW CONCURRENTLY mv_tajwid_reference;
-- outside any transaction after executing seed.*.sql.
