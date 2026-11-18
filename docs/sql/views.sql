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
                    'parent_letter_slug', l.parent_letter_slug,
                    'symbol', l.symbol,
                    'tafkhim_type', l.tafkhim_type,
                    'is_madd', l.is_madd,
                    'sort_order', l.sort_order
                ) ORDER BY l.sort_order
            ), '[]'::jsonb)
            FROM hij_letters l
        ),
        'articulation_areas', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', aa.id,
                    'slug', aa.slug,
                    'is_muhaqqaq', aa.is_muhaqqaq,
                    'sort_order', aa.sort_order
                ) ORDER BY aa.sort_order
            ), '[]'::jsonb)
            FROM hij_articulation_areas aa
        ),
        'articulation_points', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', ap.id,
                    'area_id', ap.area_id,
                    'slug', ap.slug,
                    'sort_order', ap.sort_order
                ) ORDER BY ap.sort_order
            ), '[]'::jsonb)
            FROM hij_articulation_points ap
        ),
        'trait_groups', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', tg.id,
                    'slug', tg.slug,
                    'is_lazimah', tg.is_lazimah,
                    'has_middle_trait', tg.has_middle_trait,
                    'sort_order', tg.sort_order
                ) ORDER BY tg.sort_order
            ), '[]'::jsonb)
            FROM hij_trait_groups tg
        ),
        'traits', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', t.id,
                    'group_id', t.group_id,
                    'slug', t.slug,
                    'is_middle_trait', t.is_middle_trait,
                    'sort_order', t.sort_order
                ) ORDER BY t.sort_order
            ), '[]'::jsonb)
            FROM hij_traits t
        ),
        'letter_articulations', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'letter_id', la.letter_id,
                    'point_id', la.point_id,
                    'is_primary', la.is_primary,
                    'sort_order', la.sort_order
                ) ORDER BY la.sort_order
            ), '[]'::jsonb)
            FROM hij_letter_articulations la
        ),
        'letter_traits', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'letter_id', lt.letter_id,
                    'trait_id', lt.trait_id
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
                    'parent_rule_slug', r.parent_rule_slug,
                    'category', r.category,
                    'sort_order', r.sort_order
                ) ORDER BY r.sort_order
            ), '[]'::jsonb)
            FROM taj_rules r
        ),
        'definitions', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', d.id,
                    'rule_id', d.rule_id,
                    'trigger_category', d.trigger_category,
                    'source_letter_id', d.source_letter_id,
                    'meeting_letter_id', d.meeting_letter_id,
                    'condition_metadata', d.condition_metadata
                ) ORDER BY d.rule_id, d.id
            ), '[]'::jsonb)
            FROM taj_rule_definitions d
        ),
        'examples', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', e.id,
                    'slug', e.slug,
                    'rule_id', e.rule_id,
                    'letter_id', e.letter_id,
                    'surah_number', e.surah_number,
                    'ayah_number', e.ayah_number,
                    'arabic_text', e.arabic_text,
                    'highlight_text', e.highlight_text,
                    'audio_url', e.audio_url,
                    'sort_order', e.sort_order
                ) ORDER BY e.rule_id, e.sort_order
            ), '[]'::jsonb)
            FROM taj_examples e
        ),
        'citations', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', c.id,
                    'rule_id', c.rule_id,
                    'source_slug', s.slug,
                    'verse_start', c.verse_start,
                    'verse_end', c.verse_end,
                    'verses', (
                        SELECT COALESCE(jsonb_agg(
                            jsonb_build_object(
                                'verse_number', rv.verse_number,
                                'arabic_text', rv.arabic_text
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
