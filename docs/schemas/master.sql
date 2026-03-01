-- =====================================================================
-- SETUP: EXTENSIONS & UTILITIES
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
-- LETTERS
-- =====================================================================

CREATE TABLE hij_letters (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE, -- e.g., 'alif', 'ba', 'ta', 'alif-maddiyyah'
    symbol TEXT NOT NULL UNIQUE, -- Arabic letter symbol
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
-- ARTICULATIONS (MAKHRAJ)
-- =====================================================================

-- Articulation Areas (General Makhraj)
CREATE TABLE hij_articulation_areas (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE, -- e.g., 'al-halq', 'al-lisan', 'asy-syafatain', 'al-khaisyum', 'al-jauf'
    is_muhaqqaq BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL
);

COMMENT ON TABLE hij_articulation_areas IS 'General articulation areas (5 main areas)';
COMMENT ON COLUMN hij_articulation_areas.slug IS 'Key for URL and i18n mapping';

-- RLS Policies
ALTER TABLE hij_articulation_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view hij_articulation_areas" ON hij_articulation_areas FOR SELECT USING (true);

-- Articulation Points (Specific Makhraj)
CREATE TABLE hij_articulation_points (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    area_id INT NOT NULL REFERENCES hij_articulation_areas(id) ON DELETE RESTRICT,
    slug TEXT NOT NULL UNIQUE, -- e.g., 'aqshal-halq', 'wasathul-halq', 'ma-bainas-syafatain'
    sort_order INT NOT NULL
);

CREATE INDEX idx_hij_articulation_points_area ON hij_articulation_points(area_id);

COMMENT ON TABLE hij_articulation_points IS 'Specific articulation points (17 points)';
COMMENT ON COLUMN hij_articulation_points.slug IS 'Key for URL and i18n mapping';

-- RLS Policies
ALTER TABLE hij_articulation_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view hij_articulation_points" ON hij_articulation_points FOR SELECT USING (true);

-- Letter-Articulation Junction (Supports Multiple Makhraj)
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
-- TRAITS (SIFAT)
-- =====================================================================

-- Trait Groups (Opposable pairs or standalone)
CREATE TABLE hij_trait_groups (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE, -- e.g., 'breath-flow', 'sound-strength', 'tongue-position'
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

-- Individual Traits
CREATE TABLE hij_traits (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    group_id INT NOT NULL REFERENCES hij_trait_groups(id) ON DELETE RESTRICT,
    slug TEXT NOT NULL UNIQUE, -- e.g., 'hams', 'jahr', 'syiddah', 'rakhawah', 'tawassuth'
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

-- Letter-Trait Junction
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

COMMENT ON MATERIALIZED VIEW mv_playground_data IS 'Pre-computed JSON containing all hijaiyyah data for the Playground feature. Refresh after data changes: REFRESH MATERIALIZED VIEW mv_playground_data;';

-- RLS Policy for Materialized View (allow public read access)
-- Note: MVs don't support RLS directly, but we can grant SELECT permission
-- GRANT SELECT ON mv_playground_data TO anon, authenticated;