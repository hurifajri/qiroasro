-- =====================================================================
-- SEED DATA — ARTICULATION AREAS, POINTS & LETTER MAPPINGS (MAKHARIJ)
-- =====================================================================
-- Source of truth: docs/master.md & Muqaddimah Al-Jazariyyah (vv. 9-19)
-- Model: 5 General Areas (Makhraj 'Am) & 17 Specific Points (Makhraj Khas)
-- Idempotent seed resolved via slugs, safe across arbitrary identity IDs.

BEGIN;

-- Reset identity IDs & clear stale mappings before canonical seed
TRUNCATE TABLE hij_letter_articulations, hij_articulation_points, hij_articulation_areas RESTART IDENTITY CASCADE;

-- 1. 5 Articulation Areas (Makhraj 'Am)
-- Muqaddar groups (is_muhaqqaq = FALSE)
INSERT INTO hij_articulation_areas (slug, is_muhaqqaq, sort_order) VALUES
  ('al-jauf', FALSE, 1)           -- Rongga mulut dan tenggorokan (Alif & Mad letters)
ON CONFLICT (slug) DO UPDATE SET
  is_muhaqqaq = EXCLUDED.is_muhaqqaq,
  sort_order = EXCLUDED.sort_order,
  updated_at = CURRENT_TIMESTAMP;

-- Muhaqqaq groups (is_muhaqqaq = TRUE)
INSERT INTO hij_articulation_areas (slug, is_muhaqqaq, sort_order) VALUES
  ('al-halq', TRUE, 2),           -- Tenggorokan
  ('al-lisan', TRUE, 3),          -- Lidah
  ('asy-syafatain', TRUE, 4),     -- Kedua bibir
  ('al-khaisyum', TRUE, 5)        -- Pangkal hidung (Mim, Nun with ghunnah)
ON CONFLICT (slug) DO UPDATE SET
  is_muhaqqaq = EXCLUDED.is_muhaqqaq,
  sort_order = EXCLUDED.sort_order,
  updated_at = CURRENT_TIMESTAMP;

-- 2. 17 Articulation Points (Makhraj Khas), resolving area_id via slug
-- Area 1: Al-Jauf (1 point)
-- Area 2: Al-Halq - Tenggorokan (3 points)
-- Area 3: Al-Lisan - Lidah (10 points)
-- Area 4: Asy-Syafatain - Bibir (2 points)
-- Area 5: Al-Khaisyum - Pangkal Hidung (1 point, for Ghunnah)
INSERT INTO hij_articulation_points (area_id, slug, sort_order)
SELECT a.id, v.slug, v.sort_order
FROM (VALUES
  ('al-jauf', 'jauf', 1),                                  -- Alif, Wau Maddiyyah, Ya Maddiyyah
  ('al-halq', 'aqsha-halq', 2),                            -- Pangkal tenggorokan: ء هـ
  ('al-halq', 'wasath-halq', 3),                           -- Tengah tenggorokan: ح ع
  ('al-halq', 'adna-halq', 4),                             -- Atas tenggorokan: خ غ
  ('al-lisan', 'aqsha-lisan-fauq', 5),                     -- Pangkal lidah (atas) + langit-langit lunak: ق
  ('al-lisan', 'aqsha-lisan-asfal', 6),                    -- Sedikit di depan/bawah Qaf (lunak+keras): ك
  ('al-lisan', 'wasath-lisan', 7),                         -- Tengah lidah + langit-langit atas (Hanak A'la): ج ش ي (Ghairu Maddiyyah)
  ('al-lisan', 'hafah-lisan-adhras', 8),                   -- Salah satu/kedua sisi lidah + geraham atas: ض
  ('al-lisan', 'adna-hafah-lisan', 9),                     -- Sisi depan lidah hingga ujung + gusi atas: ل
  ('al-lisan', 'tharaf-lisan-taht', 10),                   -- Ujung lidah (bawah Lam) + gusi atas: ن
  ('al-lisan', 'tharaf-lisan-zhahr-adkhal', 11),           -- Ujung lidah (sedikit ke punggung) + gusi atas: ر
  ('al-lisan', 'tharaf-lisan-ushul-tsanaya', 12),          -- Ujung lidah + pangkal gigi seri atas: ت د ط
  ('al-lisan', 'tharaf-lisan-fauq-tsanaya-sufla', 13),     -- Ujung lidah + di atas gigi seri bawah: ز س ص
  ('al-lisan', 'tharaf-lisan-athraf-tsanaya-ulya', 14),    -- Ujung lidah + ujung gigi seri atas: ث ذ ظ
  ('asy-syafatain', 'bathn-syafah-sufla', 15),             -- Bibir bawah bagian dalam + ujung gigi seri atas: ف
  ('asy-syafatain', 'syafatain', 16),                      -- Dua bibir (inthibaq: ب م; indhimam berongga: و Ghairu Maddiyyah)
  ('al-khaisyum', 'khaisyum', 17)                          -- Dengung pangkal hidung: م ن
) AS v(area_slug, slug, sort_order)
JOIN hij_articulation_areas a ON a.slug = v.area_slug
ON CONFLICT (slug) DO UPDATE SET
  area_id = EXCLUDED.area_id,
  sort_order = EXCLUDED.sort_order,
  updated_at = CURRENT_TIMESTAMP;

-- 3. Letter -> Articulation point mapping (33 rows)
-- Note: Root 'waw' and 'ya' delegate their articulations to their 2 child nodes each.
-- Mim/Nun Khaisyum is the secondary (ghunnah) articulation: is_primary = FALSE.
INSERT INTO hij_letter_articulations (letter_id, point_id, is_primary, sort_order)
SELECT l.id, p.id, v.is_primary, v.sort_order
FROM (VALUES
  ('alif', 'jauf', TRUE, 1),
  ('waw-maddiyyah', 'jauf', TRUE, 2),
  ('ya-maddiyyah', 'jauf', TRUE, 3),
  ('hamzah', 'aqsha-halq', TRUE, 4),
  ('ha-aqsha', 'aqsha-halq', TRUE, 5),
  ('ayn', 'wasath-halq', TRUE, 6),
  ('ha-wasath', 'wasath-halq', TRUE, 7),
  ('ghain', 'adna-halq', TRUE, 8),
  ('kha', 'adna-halq', TRUE, 9),
  ('qaf', 'aqsha-lisan-fauq', TRUE, 10),
  ('kaf', 'aqsha-lisan-asfal', TRUE, 11),
  ('jim', 'wasath-lisan', TRUE, 12),
  ('shin', 'wasath-lisan', TRUE, 13),
  ('ya-ghairu-maddiyyah', 'wasath-lisan', TRUE, 14),
  ('dhad', 'hafah-lisan-adhras', TRUE, 15),
  ('lam', 'adna-hafah-lisan', TRUE, 16),
  ('nun', 'tharaf-lisan-taht', TRUE, 17),
  ('ra', 'tharaf-lisan-zhahr-adkhal', TRUE, 18),
  ('ta', 'tharaf-lisan-ushul-tsanaya', TRUE, 19),
  ('dal', 'tharaf-lisan-ushul-tsanaya', TRUE, 20),
  ('tha', 'tharaf-lisan-ushul-tsanaya', TRUE, 21),
  ('zay', 'tharaf-lisan-fauq-tsanaya-sufla', TRUE, 22),
  ('sin', 'tharaf-lisan-fauq-tsanaya-sufla', TRUE, 23),
  ('shad', 'tharaf-lisan-fauq-tsanaya-sufla', TRUE, 24),
  ('tsa', 'tharaf-lisan-athraf-tsanaya-ulya', TRUE, 25),
  ('dhal', 'tharaf-lisan-athraf-tsanaya-ulya', TRUE, 26),
  ('zha', 'tharaf-lisan-athraf-tsanaya-ulya', TRUE, 27),
  ('fa', 'bathn-syafah-sufla', TRUE, 28),
  ('ba', 'syafatain', TRUE, 29),
  ('mim', 'syafatain', TRUE, 30),
  ('waw-ghairu-maddiyyah', 'syafatain', TRUE, 31),
  ('mim', 'khaisyum', FALSE, 32),
  ('nun', 'khaisyum', FALSE, 33)
) AS v(letter_slug, point_slug, is_primary, sort_order)
JOIN hij_letters l ON l.slug = v.letter_slug
JOIN hij_articulation_points p ON p.slug = v.point_slug
ON CONFLICT (letter_id, point_id) DO UPDATE SET
  is_primary = EXCLUDED.is_primary,
  sort_order = EXCLUDED.sort_order,
  updated_at = CURRENT_TIMESTAMP;

COMMIT;
