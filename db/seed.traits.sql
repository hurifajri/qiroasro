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

-- Group 6: Tidak memiliki lawan (Safir, Qalqalah, Lin, Inhiraf, Takrir, Tafasyi, Istithalah, Ghunnah)
INSERT INTO hij_traits (group_id, slug, is_middle_trait, sort_order) VALUES
(6, 'safir', false, 12),  -- Ringan/lancar
(6, 'qalqalah', false, 13),  -- Berat/diam
(6, 'lin', false, 14),  -- Berat/diam
(6, 'inhiraf', false, 15),  -- Berat/diam
(6, 'takrir', false, 16),  -- Berat/diam
(6, 'tafasyi', false, 17),  -- Berat/diam
(6, 'istithalah', false, 18),  -- Berat/diam
(6, 'ghunnah', false, 19);  -- Berat/diam

-- Group 7: Ketebalan Suara (Aridhah)
INSERT INTO hij_traits (group_id, slug, is_middle_trait, sort_order) VALUES
(7, 'tafkhim', false, 20),  -- Menebalkan
(7, 'tarqiq', false, 21);   -- Menipiskan

-- Map Letters to Traits (Sifat Lazimah only, based on markdown)
-- Using letter_id from previous seed (1-29 consonants, 30-32 madd)

-- Hamzah (1=Alif as carrier, 28=Hamzah): Jahr, Syiddah, Istifal, Infitah, Ishmat
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(1, 2), (1, 3), (1, 7), (1, 9), (1, 11);

-- Ba (2): Jahr, Syiddah, Istifal, Infitah, Idzlaq, Qalqalah
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(2, 2), (2, 3), (2, 7), (2, 9), (2, 10), (2, 14);

-- Ta (3): Hams, Syiddah, Istifal, Infitah, Ishmat
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(3, 1), (3, 3), (3, 7), (3, 9), (3, 11);

-- Tsa (4): Hams, Rakhawah, Istifal, Infitah, Ishmat
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(4, 1), (4, 4), (4, 7), (4, 9), (4, 11);

-- Jim (5): Jahr, Syiddah, Istifal, Infitah, Ishmat, Qalqalah
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(5, 2), (5, 3), (5, 7), (5, 9), (5, 11), (5, 14);

-- Ha (6): Hams, Rakhawah, Istifal, Infitah, Ishmat
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(6, 1), (6, 4), (6, 7), (6, 9), (6, 11);

-- Kha (7): Hams, Rakhawah, Isti'la, Infitah, Ishmat
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(7, 1), (7, 4), (7, 6), (7, 9), (7, 11);

-- Dal (8): Jahr, Syiddah, Istifal, Infitah, Ishmat, Qalqalah
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(8, 2), (8, 3), (8, 7), (8, 9), (8, 11), (8, 14);

-- Dzal (9): Jahr, Rakhawah, Istifal, Infitah, Ishmat
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(9, 2), (9, 4), (9, 7), (9, 9), (9, 11);

-- Ra (10): Jahr, Tawassuth, Istifal, Infitah, Idzlaq, Inhiraf, Takrir
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(10, 2), (10, 5), (10, 7), (10, 9), (10, 10), (10, 16), (10, 17);

-- Zai (11): Jahr, Rakhawah, Istifal, Infitah, Ishmat, Safir
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(11, 2), (11, 5), (11, 7), (11, 9), (11, 11), (11, 12);

-- Sin (12): Hams, Rakhawah, Istifal, Infitah, Ishmat, Safir
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(12, 1), (12, 5), (12, 7), (12, 9), (12, 11), (12, 12);

-- Syin (13): Hams, Rakhawah, Istifal, Infitah, Ishmat, Tafasyi
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(13, 1), (13, 5), (13, 7), (13, 9), (13, 11), (13, 17);

-- Shad (14): Hams, Rakhawah, Isti'la, Itbaq, Ishmat, Safir
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(14, 1), (14, 5), (14, 6), (14, 8), (14, 11), (14, 12);

-- Dhad (15): Jahr, Rakhawah, Isti'la, Itbaq, Ishmat, Istithalah
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(15, 2), (15, 5), (15, 6), (15, 8), (15, 11), (15, 18);

-- Tha (16): Jahr, Syiddah, Isti'la, Itbaq, Ishmat, Qalqalah
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(16, 2), (16, 3), (16, 6), (16, 8), (16, 11), (16, 13);

-- Zha (17): Jahr, Rakhawah, Isti'la, Itbaq, Ishmat
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(17, 2), (17, 5), (17, 6), (17, 8), (17, 11);

-- 'Ain (18): Jahr, Tawassuth, Istifal, Infitah, Ishmat
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(18, 2), (18, 4), (18, 7), (18, 9), (18, 11);

-- Ghain (19): Jahr, Rakhawah, Isti'la, Infitah, Ishmat
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(19, 2), (19, 5), (19, 6), (19, 9), (19, 11);

-- Fa (20): Hams, Rakhawah, Istifal, Infitah, Idzlaq
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(20, 1), (20, 5), (20, 7), (20, 9), (20, 10);

-- Qaf (21): Jahr, Syiddah, Isti'la, Infitah, Ishmat, Qalqalah
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(21, 2), (21, 3), (21, 6), (21, 9), (21, 11), (21, 13);

-- Kaf (22): Hams, Syiddah, Istifal, Infitah, Ishmat
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(22, 1), (22, 3), (22, 7), (22, 9), (22, 11);

-- Lam (23): Jahr, Tawassuth, Istifal, Infitah, Idzlaq, Inhiraf
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(23, 2), (23, 4), (23, 7), (23, 9), (23, 10), (23, 15);

-- Mim (24): Jahr, Tawassuth, Istifal, Infitah, Idzlaq, Ghunnah
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(24, 2), (24, 4), (24, 7), (24, 9), (24, 10), (24, 19);

-- Nun (25): Jahr, Tawassuth, Istifal, Infitah, Idzlaq, Ghunnah
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(25, 2), (25, 4), (25, 7), (25, 9), (25, 10), (25, 19);

-- Wawu (26): Jahr, Rakhawah, Istifal, Infitah, Ishmat, (Lin conditional)
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(26, 2), (26, 5), (26, 7), (26, 9), (26, 11), (26, 14);

-- Ha (27): Hams, Rakhawah, Istifal, Infitah, Ishmat
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(27, 1), (27, 5), (27, 7), (27, 9), (27, 11);

-- Ya (29): Jahr, Rakhawah, Istifal, Infitah, Ishmat, (Lin conditional)
INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
(29, 2), (29, 5), (29, 7), (29, 9), (29, 11), (29, 14);

-- Madd letters (Alif, Wau, Ya Madd): Rakhawah
-- INSERT INTO hij_letter_traits (letter_id, trait_id) VALUES
-- (30, 5), (30, 22),  -- Alif Madd
-- (31, 5), (31, 22),  -- Wau Madd
-- (32, 5), (32, 22);  -- Ya Madd