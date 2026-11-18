-- Insert 5 Articulation Areas (Makhraj 'Am)

-- Muqaddar groups (is_muhaqqaq = false)
INSERT INTO hij_articulation_areas (slug, is_muhaqqaq, sort_order) VALUES
('al-jauf', FALSE, 1);           -- Rongga mulut dan tenggorokan (Mad letters only)

-- Muhaqqaq groups (is_muhaqqaq = true)
INSERT INTO hij_articulation_areas (slug, is_muhaqqaq, sort_order) VALUES
('al-halq', TRUE, 2),           -- Tenggorokan
('al-lisan', TRUE, 3),          -- Lidah
('asy-syafatain', TRUE, 4),     -- Kedua bibir
('al-khaisyum', TRUE, 5);       -- Rongga hidung (Mim, Nun with ghunnah)

-- Insert 17 Articulation Points (Makhraj Khas)
-- Area 1: Al-Jauf (1 point)
INSERT INTO hij_articulation_points (area_id, slug, sort_order) VALUES
(1, 'jauf', 1);   -- For Alif, Wau, Ya Maddiyyah

-- Area 2: Al-Halq - Tenggorokan (3 points)
INSERT INTO hij_articulation_points (area_id, slug, sort_order) VALUES
(2, 'aqsha-halq', 2),              -- Pangkal: ء ه
(2, 'wasath-halq', 3),            -- Tengah: ح ع
(2, 'adna-halq', 4);               -- Atas: خ غ

-- Area 3: Al-Lisan - Lidah (10 points)
INSERT INTO hij_articulation_points (area_id, slug, sort_order) VALUES
(3, 'aqsha-lisan', 5),           -- Pangkal lidah + langit lunak: ق
(3, 'aqsha-lisan-asfal', 6),        -- Sedikit di bawah Qaf: ك
(3, 'wasath-lisan', 7),         -- Tengah lidah + langit tengah: ج ش ي
(3, 'hafah-lisan', 8),  -- Sisi lidah + geraham atas: ض
(3, 'adna-hafah-lisan', 9),  -- Sisi depan lidah + gusi atas: ل
(3, 'tharaf-lisan', 10),        -- Ujung lidah + gusi atas: ن
(3, 'tharaf-lisan-zhahr-adkhal', 11), -- Ujung lidah (sedikit ke punggung) + gusi: ر
(3, 'tharaf-lisan-ulya-tsanaya', 12), -- Ujung lidah + pangkal gigi atas: ت د ط
(3, 'tharaf-lisan-tsanaya-sufla', 13), -- Ujung lidah + atas gigi bawah: ز س ص
(3, 'tharaf-lisan-athraf-tsanaya-ulya', 14); -- Ujung lidah + ujung gigi atas: ث ذ ظ

-- Area 4: Asy-Syafatain - Bibir (3 points)
INSERT INTO hij_articulation_points (area_id, slug, sort_order) VALUES
(4, 'bathn-syafah', 15), -- Bibir bawah dalam + ujung gigi atas: ف
(4, 'syafatain', 16);                             -- Mengatup kedua bibir: ب م و

-- Area 5: Al-Khaisyum - Rongga Hidung (1 point, for Ghunnah)
INSERT INTO hij_articulation_points (area_id, slug, sort_order) VALUES
(5, 'khaisyum', 17);    -- Dengung hidung: م ن (when applicable)

-- Letter -> Articulation point mapping (slug based).
-- Mim/Nun Khaisyum is the secondary (ghunnah) articulation: is_primary = FALSE.
INSERT INTO hij_letter_articulations (letter_id, point_id, is_primary, sort_order)
SELECT l.id, p.id, v.is_primary, v.sort_order
FROM (VALUES
  ('alif', 'jauf', TRUE, 1),
  ('alif-madd', 'jauf', TRUE, 2),
  ('waw-madd', 'jauf', TRUE, 3),
  ('ya-madd', 'jauf', TRUE, 4),
  ('hamzah', 'aqsha-halq', TRUE, 5),
  ('ha-aqsha', 'aqsha-halq', TRUE, 6),
  ('ayn', 'wasath-halq', TRUE, 7),
  ('ha-wasath', 'wasath-halq', TRUE, 8),
  ('ghain', 'adna-halq', TRUE, 9),
  ('kha', 'adna-halq', TRUE, 10),
  ('qaf', 'aqsha-lisan', TRUE, 11),
  ('kaf', 'aqsha-lisan-asfal', TRUE, 12),
  ('jim', 'wasath-lisan', TRUE, 13),
  ('shin', 'wasath-lisan', TRUE, 14),
  ('ya', 'wasath-lisan', TRUE, 15),
  ('dhad', 'hafah-lisan', TRUE, 16),
  ('lam', 'adna-hafah-lisan', TRUE, 17),
  ('nun', 'tharaf-lisan', TRUE, 18),
  ('ra', 'tharaf-lisan-zhahr-adkhal', TRUE, 19),
  ('ta', 'tharaf-lisan-ulya-tsanaya', TRUE, 20),
  ('dal', 'tharaf-lisan-ulya-tsanaya', TRUE, 21),
  ('tha', 'tharaf-lisan-ulya-tsanaya', TRUE, 22),
  ('zay', 'tharaf-lisan-tsanaya-sufla', TRUE, 23),
  ('sin', 'tharaf-lisan-tsanaya-sufla', TRUE, 24),
  ('shad', 'tharaf-lisan-tsanaya-sufla', TRUE, 25),
  ('tsa', 'tharaf-lisan-athraf-tsanaya-ulya', TRUE, 26),
  ('dhal', 'tharaf-lisan-athraf-tsanaya-ulya', TRUE, 27),
  ('zha', 'tharaf-lisan-athraf-tsanaya-ulya', TRUE, 28),
  ('fa', 'bathn-syafah', TRUE, 29),
  ('ba', 'syafatain', TRUE, 30),
  ('mim', 'syafatain', TRUE, 31),
  ('waw', 'syafatain', TRUE, 32),
  ('mim', 'khaisyum', FALSE, 33),
  ('nun', 'khaisyum', FALSE, 34)
) AS v(letter_slug, point_slug, is_primary, sort_order)
JOIN hij_letters l ON l.slug = v.letter_slug
JOIN hij_articulation_points p ON p.slug = v.point_slug;
