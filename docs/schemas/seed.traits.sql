-- Insert Trait Groups (5 for Lazimah, groups for Aridhah)

-- Lazimah groups (is_lazimah = true)
INSERT INTO hij_trait_groups (slug, is_lazimah, has_middle_trait, sort_order) VALUES
('nafas', true, false, 1),      -- Hams vs Jahr
('shaut', true, true, 2),       -- Syiddah vs Rakhawah (+ Tawassuth)
('ittijah-shaut', true, false, 3), -- Isti'la vs Istifal
('inhishar-shaut', true, false, 4),  -- Itbaq vs Infitah
('khiffah-nuthq', true, false, 5),     -- Idzlaq vs Ishmat,
('munfaridah', true, false, 6);        -- Safir, Qalqalah, Lin, Inhiraf, Takrir, Tafasyi, Istithalah, Ghunnah

-- Aridhah groups (is_lazimah = false)
INSERT INTO hij_trait_groups (slug, is_lazimah, has_middle_trait, sort_order) VALUES
('siman-shaut', false, false, 7);     -- Tafkhim vs Tarqiq

-- Insert Individual Traits
-- Group 1: Mengalir Nafas (Hams vs Jahr)
INSERT INTO hij_traits (group_id, slug, is_middle_trait, sort_order) VALUES
(1, 'hams', false, 1),    -- Mengalirnya nafas
(1, 'jahr', false, 2);    -- Tertahannya nafas

-- Group 2: Mengalir Suara (Syiddah vs Rakhawah + Tawassuth)
INSERT INTO hij_traits (group_id, slug, is_middle_trait, sort_order) VALUES
(2, 'syiddah', false, 3),   -- Tertahannya suara
(2, 'tawassuth', true, 4),   -- Pertengahan
(2, 'rakhawah', false, 5);   -- Mengalirnya suara

-- Group 3: Posisi Pangkal Lidah (Isti'la vs Istifal)
INSERT INTO hij_traits (group_id, slug, is_middle_trait, sort_order) VALUES
(3, 'istila', false, 6),   -- Pangkal lidah naik
(3, 'istifal', false, 7);  -- Pangkal lidah rendah

-- Group 4: Posisi Lidah-Langit (Itbaq vs Infitah)
INSERT INTO hij_traits (group_id, slug, is_middle_trait, sort_order) VALUES
(4, 'itbaq', false, 8),    -- Lidah menempel langit-langit
(4, 'infitah', false, 9);  -- Lidah menjauh langit-langit

-- Group 5: Kemudahan Ucapan (Idzlaq vs Ishmat)
INSERT INTO hij_traits (group_id, slug, is_middle_trait, sort_order) VALUES
(5, 'idzlaq', false, 10),  -- Ringan/lancar
(5, 'ishmat', false, 11);  -- Berat/diam

-- Group 6: Tidak memiliki lawan (Safir, Qalqalah, Lin, Inhiraf, Takrir, Tafasyi, Istithalah, Ghunnah, Khafa)
INSERT INTO hij_traits (group_id, slug, is_middle_trait, sort_order) VALUES
(6, 'safir', false, 12),
(6, 'qalqalah', false, 13),
(6, 'lin', false, 14),
(6, 'inhiraf', false, 15),
(6, 'takrir', false, 16),
(6, 'tafasyi', false, 17),
(6, 'istithalah', false, 18),
(6, 'ghunnah', false, 19);

-- Group 7: Ketebalan Suara (Aridhah)
INSERT INTO hij_traits (group_id, slug, is_middle_trait, sort_order) VALUES
(7, 'tafkhim', false, 20),  -- Menebalkan
(7, 'tarqiq', false, 21);   -- Menipiskan

-- Khafa (Ha-aqsha and Mad letters), also a group 6 trait; kept last so ids 1-21 stay stable
INSERT INTO hij_traits (group_id, slug, is_middle_trait, sort_order)
SELECT id, 'khafa', false, 22 FROM hij_trait_groups WHERE slug = 'munfaridah'
ON CONFLICT (slug) DO NOTHING;

-- Letter -> Trait mapping (slug based, source: docs/schemas/master.md).
-- Joins on slug, so it does not depend on identity IDs.
INSERT INTO hij_letter_traits (letter_id, trait_id)
SELECT l.id, t.id
FROM (VALUES
  ('alif', 'jahr'),
  ('alif', 'rakhawah'),
  ('alif', 'istifal'),
  ('alif', 'infitah'),
  ('alif', 'ishmat'),
  ('alif', 'tafkhim'),
  ('alif', 'tarqiq'),
  ('hamzah', 'jahr'),
  ('hamzah', 'syiddah'),
  ('hamzah', 'istifal'),
  ('hamzah', 'infitah'),
  ('hamzah', 'ishmat'),
  ('hamzah', 'tarqiq'),
  ('ba', 'jahr'),
  ('ba', 'syiddah'),
  ('ba', 'istifal'),
  ('ba', 'infitah'),
  ('ba', 'idzlaq'),
  ('ba', 'qalqalah'),
  ('ba', 'tarqiq'),
  ('ta', 'hams'),
  ('ta', 'syiddah'),
  ('ta', 'istifal'),
  ('ta', 'infitah'),
  ('ta', 'ishmat'),
  ('ta', 'tarqiq'),
  ('tsa', 'hams'),
  ('tsa', 'rakhawah'),
  ('tsa', 'istifal'),
  ('tsa', 'infitah'),
  ('tsa', 'ishmat'),
  ('tsa', 'tarqiq'),
  ('jim', 'jahr'),
  ('jim', 'syiddah'),
  ('jim', 'istifal'),
  ('jim', 'infitah'),
  ('jim', 'ishmat'),
  ('jim', 'qalqalah'),
  ('jim', 'tarqiq'),
  ('ha-wasath', 'hams'),
  ('ha-wasath', 'rakhawah'),
  ('ha-wasath', 'istifal'),
  ('ha-wasath', 'infitah'),
  ('ha-wasath', 'ishmat'),
  ('ha-wasath', 'tarqiq'),
  ('kha', 'hams'),
  ('kha', 'rakhawah'),
  ('kha', 'istila'),
  ('kha', 'infitah'),
  ('kha', 'ishmat'),
  ('kha', 'tafkhim'),
  ('dal', 'jahr'),
  ('dal', 'syiddah'),
  ('dal', 'istifal'),
  ('dal', 'infitah'),
  ('dal', 'ishmat'),
  ('dal', 'qalqalah'),
  ('dal', 'tarqiq'),
  ('dhal', 'jahr'),
  ('dhal', 'rakhawah'),
  ('dhal', 'istifal'),
  ('dhal', 'infitah'),
  ('dhal', 'ishmat'),
  ('dhal', 'tarqiq'),
  ('ra', 'jahr'),
  ('ra', 'tawassuth'),
  ('ra', 'istifal'),
  ('ra', 'infitah'),
  ('ra', 'idzlaq'),
  ('ra', 'inhiraf'),
  ('ra', 'takrir'),
  ('ra', 'tafkhim'),
  ('ra', 'tarqiq'),
  ('zay', 'jahr'),
  ('zay', 'rakhawah'),
  ('zay', 'istifal'),
  ('zay', 'infitah'),
  ('zay', 'ishmat'),
  ('zay', 'safir'),
  ('zay', 'tarqiq'),
  ('sin', 'hams'),
  ('sin', 'rakhawah'),
  ('sin', 'istifal'),
  ('sin', 'infitah'),
  ('sin', 'ishmat'),
  ('sin', 'safir'),
  ('sin', 'tarqiq'),
  ('shin', 'hams'),
  ('shin', 'rakhawah'),
  ('shin', 'istifal'),
  ('shin', 'infitah'),
  ('shin', 'ishmat'),
  ('shin', 'tafasyi'),
  ('shin', 'tarqiq'),
  ('shad', 'hams'),
  ('shad', 'rakhawah'),
  ('shad', 'istila'),
  ('shad', 'itbaq'),
  ('shad', 'ishmat'),
  ('shad', 'safir'),
  ('shad', 'tafkhim'),
  ('dhad', 'jahr'),
  ('dhad', 'rakhawah'),
  ('dhad', 'istila'),
  ('dhad', 'itbaq'),
  ('dhad', 'ishmat'),
  ('dhad', 'istithalah'),
  ('dhad', 'tafkhim'),
  ('tha', 'jahr'),
  ('tha', 'syiddah'),
  ('tha', 'istila'),
  ('tha', 'itbaq'),
  ('tha', 'ishmat'),
  ('tha', 'qalqalah'),
  ('tha', 'tafkhim'),
  ('zha', 'jahr'),
  ('zha', 'rakhawah'),
  ('zha', 'istila'),
  ('zha', 'itbaq'),
  ('zha', 'ishmat'),
  ('zha', 'tafkhim'),
  ('ayn', 'jahr'),
  ('ayn', 'tawassuth'),
  ('ayn', 'istifal'),
  ('ayn', 'infitah'),
  ('ayn', 'ishmat'),
  ('ayn', 'tarqiq'),
  ('ghain', 'jahr'),
  ('ghain', 'rakhawah'),
  ('ghain', 'istila'),
  ('ghain', 'infitah'),
  ('ghain', 'ishmat'),
  ('ghain', 'tafkhim'),
  ('fa', 'hams'),
  ('fa', 'rakhawah'),
  ('fa', 'istifal'),
  ('fa', 'infitah'),
  ('fa', 'idzlaq'),
  ('fa', 'tarqiq'),
  ('qaf', 'jahr'),
  ('qaf', 'syiddah'),
  ('qaf', 'istila'),
  ('qaf', 'infitah'),
  ('qaf', 'ishmat'),
  ('qaf', 'qalqalah'),
  ('qaf', 'tafkhim'),
  ('kaf', 'hams'),
  ('kaf', 'syiddah'),
  ('kaf', 'istifal'),
  ('kaf', 'infitah'),
  ('kaf', 'ishmat'),
  ('kaf', 'tarqiq'),
  ('lam', 'jahr'),
  ('lam', 'tawassuth'),
  ('lam', 'istifal'),
  ('lam', 'infitah'),
  ('lam', 'idzlaq'),
  ('lam', 'inhiraf'),
  ('lam', 'tafkhim'),
  ('lam', 'tarqiq'),
  ('mim', 'jahr'),
  ('mim', 'tawassuth'),
  ('mim', 'istifal'),
  ('mim', 'infitah'),
  ('mim', 'idzlaq'),
  ('mim', 'ghunnah'),
  ('mim', 'tarqiq'),
  ('nun', 'jahr'),
  ('nun', 'tawassuth'),
  ('nun', 'istifal'),
  ('nun', 'infitah'),
  ('nun', 'idzlaq'),
  ('nun', 'ghunnah'),
  ('nun', 'tarqiq'),
  ('waw', 'jahr'),
  ('waw', 'rakhawah'),
  ('waw', 'istifal'),
  ('waw', 'infitah'),
  ('waw', 'ishmat'),
  ('waw', 'lin'),
  ('waw', 'tarqiq'),
  ('ha-aqsha', 'hams'),
  ('ha-aqsha', 'rakhawah'),
  ('ha-aqsha', 'istifal'),
  ('ha-aqsha', 'infitah'),
  ('ha-aqsha', 'ishmat'),
  ('ha-aqsha', 'khafa'),
  ('ha-aqsha', 'tarqiq'),
  ('ya', 'jahr'),
  ('ya', 'rakhawah'),
  ('ya', 'istifal'),
  ('ya', 'infitah'),
  ('ya', 'ishmat'),
  ('ya', 'lin'),
  ('ya', 'tarqiq'),
  ('alif-madd', 'rakhawah'),
  ('alif-madd', 'khafa'),
  ('alif-madd', 'tafkhim'),
  ('alif-madd', 'tarqiq'),
  ('waw-madd', 'rakhawah'),
  ('waw-madd', 'khafa'),
  ('waw-madd', 'tarqiq'),
  ('ya-madd', 'rakhawah'),
  ('ya-madd', 'khafa'),
  ('ya-madd', 'tarqiq')
) AS v(letter_slug, trait_slug)
JOIN hij_letters l ON l.slug = v.letter_slug
JOIN hij_traits t ON t.slug = v.trait_slug;

