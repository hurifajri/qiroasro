-- Insert 29 standard Hijaiyah consonants (Alif first, Lam-Alif excluded)
-- IDs follow insert order on a fresh table: Alif = 1 ... Ya = 29, madd = 30-32.
INSERT INTO hij_letters (slug, symbol, is_madd, sort_order) VALUES
('alif', 'ا', FALSE, 1),
('hamzah', 'ء', FALSE, 2),
('ba', 'ب', FALSE, 3),
('ta', 'ت', FALSE, 4),
('tsa', 'ث', FALSE, 5),
('jim', 'ج', FALSE, 6),
('ha-wasath', 'ح', FALSE, 7),
('kha', 'خ', FALSE, 8),
('dal', 'د', FALSE, 9),
('dhal', 'ذ', FALSE, 10),
('ra', 'ر', FALSE, 11),
('zay', 'ز', FALSE, 12),
('sin', 'س', FALSE, 13),
('shin', 'ش', FALSE, 14),
('shad', 'ص', FALSE, 15),
('dhad', 'ض', FALSE, 16),
('tha', 'ط', FALSE, 17),
('zha', 'ظ', FALSE, 18),
('ayn', 'ع', FALSE, 19),
('ghain', 'غ', FALSE, 20),
('fa', 'ف', FALSE, 21),
('qaf', 'ق', FALSE, 22),
('kaf', 'ك', FALSE, 23),
('lam', 'ل', FALSE, 24),
('mim', 'م', FALSE, 25),
('nun', 'ن', FALSE, 26),
('waw', 'و', FALSE, 27),
('ha-aqsha', 'ه', FALSE, 28),
('ya', 'ي', FALSE, 29);

-- Insert 3 Mad vowels
INSERT INTO hij_letters (slug, symbol, is_madd, sort_order) VALUES
('alif-madd', 'ـَا', TRUE, 30),
('waw-madd', 'ـُو', TRUE, 31),
('ya-madd', 'ـِي', TRUE, 32);
