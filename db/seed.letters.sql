-- Insert 29 standard Hijaiyah consonants
INSERT INTO hij_letters (slug, symbol, is_madd, sort_order) VALUES
('hamza', 'ء', FALSE, 1),
('ba', 'ب', FALSE, 2),
('ta', 'ت', FALSE, 3),
('tsa', 'ث', FALSE, 4),
('jim', 'ج', FALSE, 5),
('ha-wasath', 'ح', FALSE, 6),
('kha', 'خ', FALSE, 7),
('dal', 'د', FALSE, 8),
('dzal', 'ذ', FALSE, 9),
('ra', 'ر', FALSE, 10),
('zay', 'ز', FALSE, 11),
('sin', 'س', FALSE, 12),
('syin', 'ش', FALSE, 13),
('shad', 'ص', FALSE, 14),
('dhad', 'ض', FALSE, 15),
('tha', 'ط', FALSE, 16),
('zha', 'ظ', FALSE, 17),
('ain', 'ع', FALSE, 18),
('ghain', 'غ', FALSE, 19),
('fa', 'ف', FALSE, 20),
('qaf', 'ق', FALSE, 21),
('kaf', 'ك', FALSE, 22),
('lam', 'ل', FALSE, 23),
('mim', 'م', FALSE, 24),
('nun', 'ن', FALSE, 25),
('wawu', 'و', FALSE, 26),
('ha-aqsa', 'ه', FALSE, 27),
('lam-alif', 'لا', FALSE, 28),
('ya', 'ي', FALSE, 29);

-- Insert 3 Mad vowels
INSERT INTO hij_letters (slug, symbol, is_madd, sort_order) VALUES
('alif-madd', 'ـَا', TRUE, 30),
('wawu-madd', 'ـُو', TRUE, 31),
('ya-madd', 'ـِي', TRUE, 32);