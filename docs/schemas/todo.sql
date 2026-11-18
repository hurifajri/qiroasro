-- =====================================================================
-- MATERIALIZED VIEWS (Pre-computed for performance)
-- =====================================================================

-- Materialized View: Pre-computed playground data (all static hijaiyyah data)
-- This consolidates 7 separate queries into 1 for optimal performance
CREATE MATERIALIZED VIEW mv_playground_data AS
SELECT json_build_object(
    'letters', (
        SELECT COALESCE(json_agg(
            json_build_object(
                'id', l.id,
                'slug', l.slug,
                'symbol', l.symbol,
                'is_madd', l.is_madd,
                'sort_order', l.sort_order
            ) ORDER BY l.sort_order
        ), '[]'::json)
        FROM hij_letters l
    ),
    'articulation_areas', (
        SELECT COALESCE(json_agg(
            json_build_object(
                'id', aa.id,
                'slug', aa.slug,
                'is_muhaqqaq', aa.is_muhaqqaq,
                'sort_order', aa.sort_order
            ) ORDER BY aa.sort_order
        ), '[]'::json)
        FROM hij_articulation_areas aa
    ),
    'articulation_points', (
        SELECT COALESCE(json_agg(
            json_build_object(
                'id', ap.id,
                'area_id', ap.area_id,
                'slug', ap.slug,
                'sort_order', ap.sort_order
            ) ORDER BY ap.sort_order
        ), '[]'::json)
        FROM hij_articulation_points ap
    ),
    'trait_groups', (
        SELECT COALESCE(json_agg(
            json_build_object(
                'id', tg.id,
                'slug', tg.slug,
                'is_lazimah', tg.is_lazimah,
                'has_middle_trait', tg.has_middle_trait,
                'sort_order', tg.sort_order
            ) ORDER BY tg.sort_order
        ), '[]'::json)
        FROM hij_trait_groups tg
    ),
    'traits', (
        SELECT COALESCE(json_agg(
            json_build_object(
                'id', t.id,
                'group_id', t.group_id,
                'slug', t.slug,
                'is_middle_trait', t.is_middle_trait,
                'sort_order', t.sort_order
            ) ORDER BY t.sort_order
        ), '[]'::json)
        FROM hij_traits t
    ),
    'letter_articulations', (
        SELECT COALESCE(json_agg(
            json_build_object(
                'letter_id', la.letter_id,
                'point_id', la.point_id,
                'is_primary', la.is_primary,
                'sort_order', la.sort_order
            ) ORDER BY la.sort_order
        ), '[]'::json)
        FROM hij_letter_articulations la
    ),
    'letter_traits', (
        SELECT COALESCE(json_agg(
            json_build_object(
                'letter_id', lt.letter_id,
                'trait_id', lt.trait_id
            )
        ), '[]'::json)
        FROM hij_letter_traits lt
    )
) AS data;

-- =====================================================================
-- ENUM TYPES
-- =====================================================================

-- TODO: Update
-- Rule trigger category: tajwid rules
-- CREATE TYPE rule_category AS ENUM (
--     'nun_sukun_tanwin',    -- Nun sakinah & tanwin rules
--     'mim_sukun',           -- Mim sakinah rules
--     'madd_letters',        -- Mad/elongation rules
--     'lam_tarif',           -- Lam Al-Ta'rif rules
--     'ro_condition',        -- Ra tafkhim/tarqiq conditions
--     'lafzul_jalalah',      -- Lafzhul Jalalah rules
--     'letter_relations',    -- Mutamatsilan, mutajanisan, etc.
--     'qalqalah',            -- Qalqalah rules
--     'other'                -- Other specialized rules
-- );

-- =====================================================================
-- REFERENCE SOURCES
-- =====================================================================

CREATE TABLE ref_sources (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'tuhfatul-athfal', 'matn-jazary'

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE TRIGGER update_ref_sources_modtime
    BEFORE UPDATE ON ref_sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE ref_sources IS 'Reference textbooks/sources';
COMMENT ON COLUMN ref_sources.slug IS 'This is a key for URL or i18n mapping';

-- =====================================================================
-- REFERENCE VERSES
-- =====================================================================

CREATE TABLE ref_verses (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    source_id INT NOT NULL REFERENCES ref_sources(id) ON DELETE CASCADE,
    verse_number INT NOT NULL,
    arabic_text TEXT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,

    UNIQUE(source_id, verse_number) -- Constraint: A verse number must be unique within a source
);

CREATE INDEX idx_ref_verses_source_id ON ref_verses(source_id);

CREATE TRIGGER update_ref_verses_modtime
    BEFORE UPDATE ON ref_verses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE ref_verses IS 'Individual verses/lines from reference sources';
COMMENT ON COLUMN ref_verses.verse_number IS 'Sequential number of verse within its source';
COMMENT ON COLUMN ref_verses.arabic_text IS 'Original Arabic text - MUST be stored as it cannot be translated';

-- =====================================================================
-- TAJWID RULES
-- =====================================================================

-- Main Tajwid Rules
CREATE TABLE taj_rules (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'idgham-bighunnah', 'ikhfa-haqiqi', 'madd-wajib-muttasil'
    parent_rule_slug VARCHAR(100), -- For hierarchical rules: e.g., 'idgham' parent of 'idgham-bighunnah'
    sort_order INT NOT NULL DEFAULT 1,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_taj_rules_parent ON taj_rules(parent_rule_slug);

CREATE TRIGGER update_taj_rules_modtime
    BEFORE UPDATE ON taj_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE taj_rules IS 'Tajwid rules with hierarchical support';
COMMENT ON COLUMN taj_rules.slug IS 'This is a key for URL or i18n mapping';
COMMENT ON COLUMN taj_rules.parent_rule_slug IS 'References parent rule slug for sub-rules';

-- Rule Definitions (When rule applies)
CREATE TABLE taj_rule_definitions (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rule_id INT NOT NULL REFERENCES taj_rules(id) ON DELETE CASCADE,
    trigger_category rule_category NOT NULL,
    meeting_letter_id INT REFERENCES hij_letters(id) ON DELETE CASCADE,

    -- Additional conditions as JSON for flexibility
    condition_metadata JSONB,
    -- Example: {"requires_sukun": true, "position": "end_of_word"}

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_taj_rule_definitions_rule ON taj_rule_definitions(rule_id);
CREATE INDEX idx_taj_rule_definitions_meeting ON taj_rule_definitions(meeting_letter_id);
CREATE INDEX idx_taj_rule_definitions_trigger ON taj_rule_definitions(trigger_category);
CREATE INDEX idx_taj_rule_definitions_metadata ON taj_rule_definitions USING GIN (condition_metadata);

CREATE TRIGGER update_taj_rule_definitions_modtime
    BEFORE UPDATE ON taj_rule_definitions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE taj_rule_definitions IS 'Defines when and how tajwid rules apply';
COMMENT ON COLUMN taj_rule_definitions.meeting_letter_id IS 'The letter that triggers the rule (e.g., Ba for Iqlab)';
COMMENT ON COLUMN taj_rule_definitions.condition_metadata IS 'Additional conditions as flexible JSON';

-- =====================================================================
-- CITATIONS (References)
-- =====================================================================

-- Rule Citations (Rules → Verses, supports ranges)
CREATE TABLE taj_rule_citations (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rule_id INT NOT NULL REFERENCES taj_rules(id) ON DELETE CASCADE,
    source_id INT NOT NULL REFERENCES ref_sources(id) ON DELETE CASCADE,
    verse_start INT NOT NULL,
    verse_end INT, -- If NULL, it means it's a single verse (start only)

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,

    -- Ensure verse_end >= verse_start if provided
    CONSTRAINT chk_verse_range CHECK (verse_end IS NULL OR verse_end >= verse_start)
);

CREATE INDEX idx_taj_rule_citations_rule ON taj_rule_citations(rule_id);
CREATE INDEX idx_taj_rule_citations_source ON taj_rule_citations(source_id);
CREATE INDEX idx_taj_rule_citations_range ON taj_rule_citations(source_id, verse_start, verse_end);

CREATE TRIGGER update_taj_rule_citations_modtime
    BEFORE UPDATE ON taj_rule_citations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE taj_rule_citations IS 'Citations for tajwid rules, supports verse ranges (e.g., verses 1-3)';
COMMENT ON COLUMN taj_rule_citations.verse_end IS 'NULL for single verse, otherwise end of range';

-- Articulation Citations
CREATE TABLE hij_articulation_citations (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    point_id INT NOT NULL REFERENCES hij_articulation_points(id) ON DELETE CASCADE,
    source_id INT NOT NULL REFERENCES ref_sources(id) ON DELETE CASCADE,
    verse_start INT NOT NULL,
    verse_end INT,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,

    CONSTRAINT chk_art_verse_range CHECK (verse_end IS NULL OR verse_end >= verse_start)
);

CREATE INDEX idx_hij_articulation_citations_point ON hij_articulation_citations(point_id);
CREATE INDEX idx_hij_articulation_citations_source ON hij_articulation_citations(source_id);

CREATE TRIGGER update_hij_articulation_citations_modtime
    BEFORE UPDATE ON hij_articulation_citations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE hij_articulation_citations IS 'Citations for articulation points';

-- Trait Citations
CREATE TABLE hij_trait_citations (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trait_id INT NOT NULL REFERENCES hij_traits(id) ON DELETE CASCADE,
    source_id INT NOT NULL REFERENCES ref_sources(id) ON DELETE CASCADE,
    verse_start INT NOT NULL,
    verse_end INT,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,

    CONSTRAINT chk_trait_verse_range CHECK (verse_end IS NULL OR verse_end >= verse_start)
);

CREATE INDEX idx_hij_trait_citations_trait ON hij_trait_citations(trait_id);
CREATE INDEX idx_hij_trait_citations_source ON hij_trait_citations(source_id);

CREATE TRIGGER update_hij_trait_citations_modtime
    BEFORE UPDATE ON hij_trait_citations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE hij_trait_citations IS 'Citations for traits';

-- =====================================================================
-- PERFORMANCE INDEXES
-- =====================================================================

-- Composite indexes for common queries
CREATE INDEX idx_letters_category_sort ON hij_letters(category, sort_order);
CREATE INDEX idx_traits_category_group ON hij_traits(category, group_id);

-- Full-text search indexes (if implementing search)
-- Uncomment if need Arabic text search
-- CREATE INDEX idx_verses_arabic_text_fts ON ref_verses USING GIN (to_tsvector('arabic', arabic_text));