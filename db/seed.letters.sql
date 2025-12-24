-- Insert 29 standard Hijaiyah consonants
INSERT INTO hij_letters (slug, symbol, is_madd, sort_order) VALUES
('hamza', 'ء', false, 1),
('ba', 'ب', false, 2),
('ta', 'ت', false, 3),
('tsa', 'ث', false, 4),
('jim', 'ج', false, 5),
('ha-wasath', 'ح', false, 6),
('kha', 'خ', false, 7),
('dal', 'د', false, 8),
('dzal', 'ذ', false, 9),
('ra', 'ر', false, 10),
('zay', 'ز', false, 11),
('sin', 'س', false, 12),
('syin', 'ش', false, 13),
('shad', 'ص', false, 14),
('dhad', 'ض', false, 15),
('tha', 'ط', false, 16),
('zha', 'ظ', false, 17),
('ain', 'ع', false, 18),
('ghain', 'غ', false, 19),
('fa', 'ف', false, 20),
('qaf', 'ق', false, 21),
('kaf', 'ك', false, 22),
('lam', 'ل', false, 23),
('mim', 'م', false, 24),
('nun', 'ن', false, 25),
('wawu', 'و', false, 26),
('ha-aqsa', 'ه', false, 27),
('lam-alif', 'لا', false, 28),
('ya', 'ي', false, 29);

-- Insert 3 Mad vowels
INSERT INTO hij_letters (slug, symbol, is_madd, sort_order) VALUES
('alif-madd', 'ـَا', true, 30),
('wawu-madd', 'ـُو', true, 31),
('ya-madd', 'ـِي', true, 32);