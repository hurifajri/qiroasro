-- Insert 5 Articulation Areas (Makhraj 'Am)
INSERT INTO hij_articulation_areas (slug, sort_order) VALUES
('al-jauf', 1),           -- Rongga mulut dan tenggorokan (Mad letters only)
('al-halq', 2),           -- Tenggorokan
('al-lisan', 3),          -- Lidah
('asy-syafatan', 4),     -- Kedua bibir
('al-khaisyum', 5);       -- Rongga hidung (Mim, Nun with ghunnah)

-- Insert 17 Articulation Points (Makhraj Khas)
-- Area 1: Al-Jauf (1 point)
INSERT INTO hij_articulation_points (area_id, slug, sort_order) VALUES
(1, 'jauf-madd', 1);   -- For Alif, Wau, Ya Maddiyyah

-- Area 2: Al-Halq - Tenggorokan (3 points)
INSERT INTO hij_articulation_points (area_id, slug, sort_order) VALUES
(2, 'aqsa-halq', 2),              -- Pangkal: ء ه
(2, 'wasath-halq', 3),            -- Tengah: ح ع
(2, 'adna-halq', 4);               -- Atas: خ غ

-- Area 3: Al-Lisan - Lidah (10 points)
INSERT INTO hij_articulation_points (area_id, slug, sort_order) VALUES
(3, 'aqsa-lahmi', 5),           -- Pangkal lidah + langit lunak: ق
(3, 'aqsa-hanak', 6),        -- Sedikit di bawah Qaf: ك
(3, 'wasath-hanak', 7),         -- Tengah lidah + langit tengah: ج ش ي
(3, 'haffah-adhras', 8),  -- Sisi lidah + geraham atas: ض
(3, 'haffah-litsah', 9),  -- Sisi depan lidah + gusi atas: ل
(3, 'tharaf-zahr', 10), -- Ujung lidah (sedikit ke punggung) + gusi: ر
(3, 'tharaf-litsah', 11),        -- Ujung lidah + gusi atas: ن
(3, 'tharaf-sufla', 12), -- Ujung lidah + atas gigi bawah: ز س ص
(3, 'tharaf-ushul', 13), -- Ujung lidah + pangkal gigi atas: ت د ط
(3, 'tharaf-athraf', 14); -- Ujung lidah + ujung gigi atas: ث ذ ظ

-- Area 4: Asy-Syafatain - Bibir (3 points)
INSERT INTO hij_articulation_points (area_id, slug, sort_order) VALUES
(4, 'bathn-syafah', 15), -- Bibir bawah dalam + ujung gigi atas: ف
(4, 'syafatain-thabaq', 16),                             -- Mengatup kedua bibir: ب م و

-- Area 5: Al-Khaisyum - Rongga Hidung (1 point, for Ghunnah)
INSERT INTO hij_articulation_points (area_id, slug, sort_order) VALUES
(5, 'khaisyum-ghunnah', 17);    -- Dengung hidung: م ن (when applicable)

-- Map Letters to Articulation Points
-- Mad letters (Alif, Wau, Ya Madd)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(28, 1, 4), (30, 1, 1),  -- Alif-madd -> Al-Jauf
(31, 1, 2),  -- Wau-madd -> Al-Jauf
(32, 1, 3);  -- Ya-madd -> Al-Jauf

-- Hamzah (ء) + Ha (ه)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(1, 2, 4),  -- Hamzah -> Aqshal Halq
(27, 2, 5);  -- Ha -> Aqshal Halq

-- Ha (ح) + 'Ain (ع)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(18, 3, 6),   -- Ha -> Wasathul Halq
(6, 3, 7);  -- 'Ain -> Wasathul Halq

-- Kha (خ) + Ghain (غ)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(19, 4, 8),   -- Kha -> Adnal Halq
(7, 4, 9);  -- Ghain -> Adnal Halq

-- Qaf (ق)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(21, 5, 10);  -- Qaf -> Aqshal Lisan + Hanakil Lahmi

-- Kaf (ك)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(22, 6, 11);  -- Kaf -> Aqshal Lisan qabla Qaf

-- Jim (ج) + Syin (ش) + Ya (ي)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(5, 7, 12),   -- Jim -> Wasathul Lisan
(13, 7, 13),  -- Syin -> Wasathul Lisan
(29, 7, 14);  -- Ya -> Wasathul Lisan

-- Dhad (ض)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(15, 8, 15);  -- Dhad -> Ihda Haffatayil Lisan

-- Lam (ل)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(23, 9, 16);  -- Lam -> Adna Haffatayil Lisan

-- Ra (ر)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(10, 10, 17); -- Ra -> Tharaful Lisan + Zahrihi

-- Nun (ن)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(25, 11, 18), -- Nun -> Tharaful Lisan + Litsatil Ulya (primary)
(25, 17, 19); -- Nun -> Al-Ghunnah (secondary for ghunnah aspect)

-- Zai (ز) + Sin (س) + Shad (ص)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(11, 12, 20), -- Zai -> Tharaful Lisan + Fauqats Tsanayas Sufla
(12, 12, 21), -- Sin -> Tharaful Lisan + Fauqats Tsanayas Sufla
(14, 12, 22); -- Shad -> Tharaful Lisan + Fauqats Tsanayas Sufla

-- Ta (ت) + Dal (د) + Tha (ط)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(3, 13, 23),  -- Ta -> Tharaful Lisan + Ushuli Tsanayal Ulya
(8, 13, 24),  -- Dal -> Tharaful Lisan + Ushuli Tsanayal Ulya
(16, 13, 25); -- Tha -> Tharaful Lisan + Ushuli Tsanayal Ulya

-- Tsa (ث) + Dzal (ذ) + Zha (ظ)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(4, 14, 26),  -- Tsa -> Tharaful Lisan + Athrafits Tsanayal Ulya
(9, 14, 27),  -- Dzal -> Tharaful Lisan + Athrafits Tsanayal Ulya
(17, 14, 28); -- Zha -> Tharaful Lisan + Athrafits Tsanayal Ulya

-- Fa (ف)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(20, 15, 29); -- Fa -> Bathnus Syafatain Sufla + Athrafits Tsanayal Ulya

-- Ba (ب) + Mim (م) + Wau (و)
INSERT INTO hij_letter_articulations (letter_id, point_id, sort_order) VALUES
(2, 16, 30),  -- Ba -> Ma bainas Syafatain
(24, 16, 31), -- Mim -> Ma bainas Syafatain (primary)
(24, 17, 32), -- Mim -> Al-Ghunnah (secondary for ghunnah aspect)
(26, 16, 33); -- Wau -> Ma bainas Syafatain
