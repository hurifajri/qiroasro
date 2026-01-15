-- =====================================================================
-- 0. SETUP: EXTENSIONS & UTILITIES
-- =====================================================================

-- Enable UUID generation if needed for user IDs
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auto-update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- 1. ENUM TYPES
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
-- 2. LETTERS
-- =====================================================================

CREATE TABLE hij_letters (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'alif', 'ba', 'ta', 'alif-maddiyyah'
    symbol VARCHAR(10) NOT NULL, -- Arabic letter symbol
    is_madd BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL,
);

CREATE INDEX idx_hij_letters_is_madd ON hij_letters(is_madd);
CREATE INDEX idx_hij_letters_sort_order ON hij_letters(sort_order);

COMMENT ON TABLE hij_letters IS 'All hijaiyyah letters including standard consonants (29) and mad vowels (3)';
COMMENT ON COLUMN hij_letters.slug IS 'Key for URL and i18n mapping';
COMMENT ON COLUMN hij_letters.symbol IS 'Arabic letter symbol';

-- RLS Policies
ALTER TABLE hij_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view hij_letters" ON hij_letters FOR SELECT USING (true);

-- =====================================================================
-- 3. ARTICULATIONS (MAKHRAJ)
-- =====================================================================

-- 3.1 Articulation Areas (General Makhraj)
CREATE TABLE hij_articulation_areas (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'al-halq', 'al-lisan', 'asy-syafatain', 'al-khaisyum', 'al-jauf'
    is_muhaqqaq BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL
);

COMMENT ON TABLE hij_articulation_areas IS 'General articulation areas (5 main areas)';
COMMENT ON COLUMN hij_articulation_areas.slug IS 'Key for URL and i18n mapping';

-- RLS Policies
ALTER TABLE hij_articulation_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view hij_articulation_areas" ON hij_articulation_areas FOR SELECT USING (true);

-- 3.2 Articulation Points (Specific Makhraj)
CREATE TABLE hij_articulation_points (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    area_id INT NOT NULL REFERENCES hij_articulation_areas(id) ON DELETE RESTRICT,
    slug VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'aqshal-halq', 'wasathul-halq', 'ma-bainas-syafatain'
    sort_order INT NOT NULL
);

CREATE INDEX idx_hij_articulation_points_area ON hij_articulation_points(area_id);

COMMENT ON TABLE hij_articulation_points IS 'Specific articulation points (17 points)';
COMMENT ON COLUMN hij_articulation_points.slug IS 'Key for URL and i18n mapping';

-- RLS Policies
ALTER TABLE hij_articulation_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view hij_articulation_points" ON hij_articulation_points FOR SELECT USING (true);

-- 3.3 Letter-Articulation Junction (Supports Multiple Makhraj)
CREATE TABLE hij_letter_articulations (
    letter_id INT NOT NULL REFERENCES hij_letters(id) ON DELETE RESTRICT,
    point_id INT NOT NULL REFERENCES hij_articulation_points(id) ON DELETE RESTRICT,
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL,

    PRIMARY KEY (letter_id, point_id) -- Constraint: Must target exactly one entity type
);

CREATE INDEX idx_hij_letter_articulations_point ON hij_letter_articulations(point_id);
CREATE INDEX idx_hij_letter_articulations_primary ON hij_letter_articulations(letter_id, is_primary);

COMMENT ON TABLE hij_letter_articulations IS 'Maps letters to their articulation points. Supports multiple points per letter (e.g., Mim, Nun)';
COMMENT ON COLUMN hij_letter_articulations.is_primary IS 'Marks the primary articulation point if multiple exist';

-- RLS Policies
ALTER TABLE hij_letter_articulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view hij_letter_articulations" ON hij_letter_articulations FOR SELECT USING (true);

-- =====================================================================
-- 4. TRAITS (SIFAT)
-- =====================================================================

-- 4.1 Trait Groups (Opposable pairs or standalone)
CREATE TABLE hij_trait_groups (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'breath-flow', 'sound-strength', 'tongue-position'
    is_lazimah BOOLEAN NOT NULL DEFAULT TRUE,
    has_middle_trait BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL
);

CREATE INDEX idx_hij_trait_groups_lazimah ON hij_trait_groups(is_lazimah);

COMMENT ON TABLE hij_trait_groups IS 'Groups of related traits';
COMMENT ON COLUMN hij_trait_groups.slug IS 'Key for URL and i18n mapping';
COMMENT ON COLUMN hij_trait_groups.has_middle_trait IS 'True if group has middle-ground trait (e.g., tawassuth)';

-- RLS Policies
ALTER TABLE hij_trait_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view hij_trait_groups" ON hij_trait_groups FOR SELECT USING (true);

-- 4.2 Individual Traits
CREATE TABLE hij_traits (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    group_id INT NOT NULL REFERENCES hij_trait_groups(id) ON DELETE RESTRICT,
    slug VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'hams', 'jahr', 'syiddah', 'rakhawah', 'tawassuth'
    is_middle_trait BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL
);

CREATE INDEX idx_hij_traits_group ON hij_traits(group_id);

COMMENT ON TABLE hij_traits IS 'Individual traits with support for opposites and middle-ground traits';
COMMENT ON COLUMN hij_traits.slug IS 'This is a key for URL or i18n mapping';
COMMENT ON COLUMN hij_traits.is_middle_trait IS 'True for middle-ground traits like Tawassuth';

-- RLS Policies
ALTER TABLE hij_traits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view hij_traits" ON hij_traits FOR SELECT USING (true);

-- 4.3 Letter-Trait Junction
CREATE TABLE hij_letter_traits (
    letter_id INT NOT NULL REFERENCES hij_letters(id) ON DELETE CASCADE,
    trait_id INT NOT NULL REFERENCES hij_traits(id) ON DELETE CASCADE,

    PRIMARY KEY (letter_id, trait_id) -- Constraint: Must target exactly one entity type
);

CREATE INDEX idx_hij_letter_traits_trait ON hij_letter_traits(trait_id);

COMMENT ON TABLE hij_letter_traits IS 'Maps letters to their traits (both lazimah and aridhah)';

-- RLS Policies
ALTER TABLE hij_letter_traits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view hij_letter_traits" ON hij_letter_traits FOR SELECT USING (true);

-- =====================================================================
-- 5. REFERENCE SOURCES
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
-- 6. REFERENCE VERSES
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
-- 7. TAJWID RULES
-- =====================================================================

-- 7.1 Main Tajwid Rules
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

-- 7.2 Rule Definitions (When rule applies)
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
-- 8. CITATIONS (References)
-- =====================================================================

-- 8.1 Rule Citations (Rules → Verses, supports ranges)
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

-- 8.2 Articulation Citations
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

-- 8.3 Trait Citations
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
-- 9. MATERIALIZED VIEWS (Pre-computed for performance)
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

COMMENT ON MATERIALIZED VIEW mv_playground_data IS 'Pre-computed JSON containing all hijaiyyah data for the Playground feature. Refresh after data changes: REFRESH MATERIALIZED VIEW mv_playground_data;';

-- RLS Policy for Materialized View (allow public read access)
-- Note: MVs don't support RLS directly, but we can grant SELECT permission
-- GRANT SELECT ON mv_playground_data TO anon, authenticated;

-- =====================================================================
-- 10. PERFORMANCE INDEXES
-- =====================================================================

-- Composite indexes for common queries
CREATE INDEX idx_letters_category_sort ON hij_letters(category, sort_order);
CREATE INDEX idx_traits_category_group ON hij_traits(category, group_id);

-- Full-text search indexes (if implementing search)
-- Uncomment if need Arabic text search
-- CREATE INDEX idx_verses_arabic_text_fts ON ref_verses USING GIN (to_tsvector('arabic', arabic_text));