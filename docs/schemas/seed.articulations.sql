-- Insert 5 Articulation Areas (Makhraj 'Am)

-- Muqaddar groups (is_muhaqqaq = false)
INSERT INTO hij_articulation_areas (slug, is_muhaqqaq, sort_order) VALUES
('al-jauf', FALSE, 1),           -- Rongga mulut dan tenggorokan (Mad letters only)

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
(4, 'syafatain', 16),                             -- Mengatup kedua bibir: ب م و

-- Area 5: Al-Khaisyum - Rongga Hidung (1 point, for Ghunnah)
INSERT INTO hij_articulation_points (area_id, slug, sort_order) VALUES
(5, 'khaisyum', 17);    -- Dengung hidung: م ن (when applicable)

-- Map Letters to Articulation Points
-- Mad letters (Alif, Wau, Ya Madd)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(28, 1, 1), (30, 1, 2),  -- Alif-madd -> Al-Jauf
(31, 1, 3),  -- Wau-madd -> Al-Jauf
(32, 1, 4);  -- Ya-madd -> Al-Jauf

-- Hamzah (ء) + Ha (ه)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(1, 2, 5),  -- Hamzah -> Aqshal Halq
(27, 2, 6);  -- Ha -> Aqshal Halq

-- Ha (ح) + 'Ain (ع)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(18, 3, 7),   -- Ha -> Wasathul Halq
(6, 3, 8);  -- 'Ain -> Wasathul Halq

-- Kha (خ) + Ghain (غ)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(19, 4, 9),   -- Kha -> Adnal Halq
(7, 4, 10);  -- Ghain -> Adnal Halq

-- Qaf (ق)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(21, 5, 11);  -- Qaf -> Aqshal Lisan + Hanakil Lahmi

-- Kaf (ك)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(22, 6, 12);  -- Kaf -> Aqshal Lisan qabla Qaf

-- Jim (ج) + Syin (ش) + Ya (ي)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(5, 7, 13),   -- Jim -> Wasathul Lisan
(13, 7, 14),  -- Syin -> Wasathul Lisan
(29, 7, 15);  -- Ya -> Wasathul Lisan

-- Dhad (ض)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(15, 8, 16);  -- Dhad -> Ihda Haffatayil Lisan

-- Lam (ل)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(23, 9, 17);  -- Lam -> Adna Haffatayil Lisan

-- Nun (ن)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(25, 11, 18), -- Nun -> Tharaful Lisan + Litsatil Ulya (primary)
(25, 17, 19); -- Nun -> Al-Ghunnah (secondary for ghunnah aspect)

-- Ra (ر)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(10, 10, 20); -- Ra -> Tharaful Lisan + Zahrihi

-- Zai (ز) + Sin (س) + Shad (ص)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(11, 12, 21), -- Zai -> Tharaful Lisan + Fauqats Tsanayas Sufla
(12, 12, 22), -- Sin -> Tharaful Lisan + Fauqats Tsanayas Sufla
(14, 12, 23); -- Shad -> Tharaful Lisan + Fauqats Tsanayas Sufla

-- Ta (ت) + Dal (د) + Tha (ط)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(3, 13, 24),  -- Ta -> Tharaful Lisan + Ushuli Tsanayal Ulya
(8, 13, 25),  -- Dal -> Tharaful Lisan + Ushuli Tsanayal Ulya
(16, 13, 26); -- Tha -> Tharaful Lisan + Ushuli Tsanayal Ulya

-- Tsa (ث) + Dzal (ذ) + Zha (ظ)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(4, 14, 27),  -- Tsa -> Tharaful Lisan + Athrafits Tsanayal Ulya
(9, 14, 28),  -- Dzal -> Tharaful Lisan + Athrafits Tsanayal Ulya
(17, 14, 29); -- Zha -> Tharaful Lisan + Athrafits Tsanayal Ulya

-- Fa (ف)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(20, 15, 30); -- Fa -> Bathnus Syafatain Sufla + Athrafits Tsanayal Ulya

-- Ba (ب) + Mim (م) + Wau (و)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(2, 16, 31),  -- Ba -> Ma bainas Syafatain
(24, 16, 32), -- Mim -> Ma bainas Syafatain (primary)
(24, 17, 33), -- Mim -> Al-Ghunnah (secondary for ghunnah aspect)
(26, 16, 34); -- Wau -> Ma bainas Syafatain
