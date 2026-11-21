-- =====================================================================
-- SEED DATA — HIJAIYYAH LETTERS (29 Root Letters + 4 Waw/Ya Branch Nodes)
-- =====================================================================
-- Source of truth: docs/master.md
-- Structure:
--   - Deterministic IDs via TRUNCATE ... RESTART IDENTITY CASCADE:
--       * IDs 1..29 : 29 root Hijaiyyah letters (parent_letter_slug IS NULL)
--       * IDs 30..33: 4 child variant nodes (waw-maddiyyah, waw-ghairu-maddiyyah,
--                     ya-maddiyyah, ya-ghairu-maddiyyah)
--   - Classified by tafkhim_type:
--       * always_tafkhim : 7 Isti'la letters (خ ص ض غ ط ق ظ)
--       * conditional    : 3 letters (ا ل ر)
--       * always_tarqiq  : 19 remaining Istifal letters
--   - Alif is a single unified Maddiyyah entity ('alif', is_madd = TRUE).
--   - Display ordering (sort_order 1..33):
--       * waw-ghairu-maddiyyah (28) & waw-maddiyyah (29) immediately after waw (27)
--       * ha-aqsha (30), ya (31)
--       * ya-ghairu-maddiyyah (32) & ya-maddiyyah (33) immediately after ya (31)
-- Idempotent seed using TRUNCATE RESTART IDENTITY CASCADE + ON CONFLICT (slug) DO UPDATE SET.

BEGIN;

-- 0. Reset identity IDs & clear legacy/stale rows cleanly
TRUNCATE TABLE hij_letters RESTART IDENTITY CASCADE;

-- 1. 29 Root Hijaiyyah Letters (Alif -> Ya, Lam-Alif excluded as composite)
INSERT INTO hij_letters (
  slug,
  parent_letter_slug,
  symbol,
  tafkhim_type,
  is_madd,
  sort_order
) VALUES
  ('alif',      NULL, 'ا', 'conditional',    TRUE,  1),
  ('hamzah',    NULL, 'ء', 'always_tarqiq',  FALSE, 2),
  ('ba',        NULL, 'ب', 'always_tarqiq',  FALSE, 3),
  ('ta',        NULL, 'ت', 'always_tarqiq',  FALSE, 4),
  ('tsa',       NULL, 'ث', 'always_tarqiq',  FALSE, 5),
  ('jim',       NULL, 'ج', 'always_tarqiq',  FALSE, 6),
  ('ha-wasath', NULL, 'ح', 'always_tarqiq',  FALSE, 7),
  ('kha',       NULL, 'خ', 'always_tafkhim', FALSE, 8),
  ('dal',       NULL, 'د', 'always_tarqiq',  FALSE, 9),
  ('dhal',      NULL, 'ذ', 'always_tarqiq',  FALSE, 10),
  ('ra',        NULL, 'ر', 'conditional',    FALSE, 11),
  ('zay',       NULL, 'ز', 'always_tarqiq',  FALSE, 12),
  ('sin',       NULL, 'س', 'always_tarqiq',  FALSE, 13),
  ('shin',      NULL, 'ش', 'always_tarqiq',  FALSE, 14),
  ('shad',      NULL, 'ص', 'always_tafkhim', FALSE, 15),
  ('dhad',      NULL, 'ض', 'always_tafkhim', FALSE, 16),
  ('tha',       NULL, 'ط', 'always_tafkhim', FALSE, 17),
  ('zha',       NULL, 'ظ', 'always_tafkhim', FALSE, 18),
  ('ayn',       NULL, 'ع', 'always_tarqiq',  FALSE, 19),
  ('ghain',     NULL, 'غ', 'always_tafkhim', FALSE, 20),
  ('fa',        NULL, 'ف', 'always_tarqiq',  FALSE, 21),
  ('qaf',       NULL, 'ق', 'always_tafkhim', FALSE, 22),
  ('kaf',       NULL, 'ك', 'always_tarqiq',  FALSE, 23),
  ('lam',       NULL, 'ل', 'conditional',    FALSE, 24),
  ('mim',       NULL, 'م', 'always_tarqiq',  FALSE, 25),
  ('nun',       NULL, 'ن', 'always_tarqiq',  FALSE, 26),
  ('waw',       NULL, 'و', 'always_tarqiq',  FALSE, 27),
  ('ha-aqsha',  NULL, 'ه', 'always_tarqiq',  FALSE, 30),
  ('ya',        NULL, 'ي', 'always_tarqiq',  FALSE, 31)
ON CONFLICT (slug) DO UPDATE SET
  parent_letter_slug = EXCLUDED.parent_letter_slug,
  symbol             = EXCLUDED.symbol,
  tafkhim_type       = EXCLUDED.tafkhim_type,
  is_madd            = EXCLUDED.is_madd,
  sort_order         = EXCLUDED.sort_order,
  updated_at         = CURRENT_TIMESTAMP;

-- 2. 4 Child Variant Nodes (IDs 30..33; sort_order grouped after parent Waw & Ya)
INSERT INTO hij_letters (
  slug,
  parent_letter_slug,
  symbol,
  tafkhim_type,
  is_madd,
  sort_order
) VALUES
  ('waw-maddiyyah',        'waw', 'ـُو', 'always_tarqiq', TRUE,  28),
  ('waw-ghairu-maddiyyah', 'waw', 'و',   'always_tarqiq', FALSE, 29),
  ('ya-maddiyyah',         'ya',  'ـِي', 'always_tarqiq', TRUE,  32),
  ('ya-ghairu-maddiyyah',  'ya',  'ي',   'always_tarqiq', FALSE, 33)
ON CONFLICT (slug) DO UPDATE SET
  parent_letter_slug = EXCLUDED.parent_letter_slug,
  symbol             = EXCLUDED.symbol,
  tafkhim_type       = EXCLUDED.tafkhim_type,
  is_madd            = EXCLUDED.is_madd,
  sort_order         = EXCLUDED.sort_order,
  updated_at         = CURRENT_TIMESTAMP;

COMMIT;
