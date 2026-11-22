-- =====================================================================
-- SEED DATA — CURATED & AUTHORED DUOLINGO-STYLE CURRICULUM QUESTIONS
-- =====================================================================
-- Prerequisites: src/db/*-schema.ts (pnpm db:push), seed.references.sql, seed.tajwid.sql
-- Source of truth: src/app/[locale]/(private)/_lib/curriculum.ts
-- Idempotent seed using ON CONFLICT (slug) DO UPDATE SET.

BEGIN;

TRUNCATE TABLE cur_questions RESTART IDENTITY CASCADE;

-- 1. Curated & Authored Curriculum Questions (All 6 question types, covering authored units & rule topics)
INSERT INTO cur_questions (
  slug,
  topic_slug,
  unit_slug,
  question_type,
  difficulty,
  rule_id,
  example_id,
  verse_id,
  question_data,
  sort_order
)
SELECT
  v.slug,
  v.topic_slug,
  v.unit_slug,
  v.question_type::question_type,
  v.difficulty,
  r.id,
  e.id,
  rv.id,
  v.question_data::jsonb,
  v.sort_order
FROM (VALUES
  -- Authored Unit 1: noble-quran / quran-delivery-method
  (
    'nq-delivery-q1',
    'noble-quran',
    'quran-delivery-method',
    'multiple_choice',
    1,
    'talaqqi-tawatur',
    NULL,
    'muqoddimah-jazariyyah',
    28,
    '{"promptKey": "quiz_content.noble_quran.quran_delivery_method.q1.question", "options": [{"id": "a1", "textKey": "quiz_content.noble_quran.quran_delivery_method.q1.a1"}, {"id": "a2", "textKey": "quiz_content.noble_quran.quran_delivery_method.q1.a2"}, {"id": "a3", "textKey": "quiz_content.noble_quran.quran_delivery_method.q1.a3"}, {"id": "a4", "textKey": "quiz_content.noble_quran.quran_delivery_method.q1.a4"}], "correctOptionId": "a1"}',
    1
  ),
  (
    'nq-delivery-q2',
    'noble-quran',
    'quran-delivery-method',
    'true_false',
    1,
    'talaqqi-tawatur',
    NULL,
    NULL,
    NULL,
    '{"promptKey": "curriculum.questions.nq_delivery_q2.prompt", "correctBoolean": true, "explanationKey": "curriculum.questions.nq_delivery_q2.explanation"}',
    2
  ),
  (
    'nq-delivery-q3',
    'noble-quran',
    'quran-delivery-method',
    'complete_matan',
    2,
    'talaqqi-tawatur',
    NULL,
    'muqoddimah-jazariyyah',
    28,
    '{"promptKey": "curriculum.questions.nq_delivery_q3.prompt", "missingWord": "إِلَيْنَا", "choices": ["إِلَيْنَا", "أُنْزِلَا", "تَوَاتُرًا", "لَازِمًا"], "explanationKey": "curriculum.questions.nq_delivery_q3.explanation"}',
    3
  ),

  -- Authored Unit 2: noble-quran / mutawatir-definition
  (
    'nq-mutawatir-q1',
    'noble-quran',
    'mutawatir-definition',
    'multiple_choice',
    1,
    'talaqqi-tawatur',
    NULL,
    NULL,
    NULL,
    '{"promptKey": "quiz_content.noble_quran.mutawatir_definition.q1.question", "options": [{"id": "a1", "textKey": "quiz_content.noble_quran.mutawatir_definition.q1.a1"}, {"id": "a2", "textKey": "quiz_content.noble_quran.mutawatir_definition.q1.a2"}, {"id": "a3", "textKey": "quiz_content.noble_quran.mutawatir_definition.q1.a3"}, {"id": "a4", "textKey": "quiz_content.noble_quran.mutawatir_definition.q1.a4"}], "correctOptionId": "a2"}',
    1
  ),
  (
    'nq-mutawatir-q2',
    'noble-quran',
    'mutawatir-definition',
    'match_pairs',
    2,
    'talaqqi-tawatur',
    NULL,
    'qosidah-alkhoqoniyyah',
    8,
    '{"promptKey": "curriculum.questions.nq_mutawatir_q2.prompt", "pairs": [{"leftKey": "sanad", "rightKey": "continuous_chain_to_prophet"}, {"leftKey": "rasm", "rightKey": "matches_utsmani_mushaf"}, {"leftKey": "lughah", "rightKey": "valid_arabic_grammar"}], "explanationKey": "curriculum.questions.nq_mutawatir_q2.explanation"}',
    2
  ),

  -- Authored Unit 3: noble-quran / oral-transmission-process
  (
    'nq-oral-q1',
    'noble-quran',
    'oral-transmission-process',
    'multiple_choice',
    1,
    'talaqqi-tawatur',
    NULL,
    'qosidah-alkhoqoniyyah',
    7,
    '{"promptKey": "quiz_content.noble_quran.oral_transmission_process.q1.question", "options": [{"id": "a1", "textKey": "quiz_content.noble_quran.oral_transmission_process.q1.a1"}, {"id": "a2", "textKey": "quiz_content.noble_quran.oral_transmission_process.q1.a2"}, {"id": "a3", "textKey": "quiz_content.noble_quran.oral_transmission_process.q1.a3"}, {"id": "a4", "textKey": "quiz_content.noble_quran.oral_transmission_process.q1.a4"}], "correctOptionId": "a3"}',
    1
  ),
  (
    'nq-oral-q2',
    'noble-quran',
    'oral-transmission-process',
    'true_false',
    1,
    'talaqqi-tawatur',
    NULL,
    NULL,
    NULL,
    '{"promptKey": "curriculum.questions.nq_oral_q2.prompt", "correctBoolean": false, "explanationKey": "curriculum.questions.nq_oral_q2.explanation"}',
    2
  ),

  -- Authored Unit 4: noble-quran / quran-codification
  (
    'nq-codification-q1',
    'noble-quran',
    'quran-codification',
    'match_pairs',
    2,
    'rasm-utsmani',
    NULL,
    NULL,
    NULL,
    '{"promptKey": "curriculum.questions.nq_codification_q1.prompt", "pairs": [{"leftKey": "abu_bakr", "rightKey": "first_compilation_suhuf"}, {"leftKey": "utsman", "rightKey": "standard_mushaf_copies"}, {"leftKey": "zaid_ibn_tsabit", "rightKey": "chief_scribe"}], "explanationKey": "curriculum.questions.nq_codification_q1.explanation"}',
    1
  ),
  (
    'nq-codification-q2',
    'noble-quran',
    'quran-codification',
    'true_false',
    1,
    'rasm-utsmani',
    NULL,
    NULL,
    NULL,
    '{"promptKey": "curriculum.questions.nq_codification_q2.prompt", "correctBoolean": true, "explanationKey": "curriculum.questions.nq_codification_q2.explanation"}',
    2
  ),

  -- Core Tajwid, Mistake Recognition & Matan Completion Exercises across Topics
  (
    'taj-science-matan-hukm',
    'tajweed-science',
    'talaqqi-tawatur',
    'complete_matan',
    2,
    'talaqqi-tawatur',
    NULL,
    'muqoddimah-jazariyyah',
    27,
    '{"promptKey": "curriculum.questions.taj_science_matan_hukm.prompt", "missingWord": "حَتْمٌ", "choices": ["حَتْمٌ", "سُنَّةٌ", "مَنْدُوبٌ", "فَرْضُ كِفَايَةٍ"], "explanationKey": "curriculum.questions.taj_science_matan_hukm.explanation"}',
    1
  ),
  (
    'common-mistakes-lahn-diff',
    'common-mistakes',
    'lahn-jali-khafi',
    'match_pairs',
    1,
    'lahn-jali-khafi',
    NULL,
    'qosidah-alkhoqoniyyah',
    24,
    '{"promptKey": "curriculum.questions.common_mistakes_lahn_diff.prompt", "pairs": [{"leftKey": "lahn_jali", "rightKey": "changes_letter_or_harakat"}, {"leftKey": "lahn_khafi", "rightKey": "violates_ghunnah_or_madd"}], "explanationKey": "curriculum.questions.common_mistakes_lahn_diff.explanation"}',
    1
  ),
  (
    'mim-nun-spot-iqlab',
    'mim-nun-rules',
    'iqlab',
    'spot_in_ayah',
    1,
    'iqlab',
    'ex-iqlab-min-badi',
    'tuhfatul-athfal',
    13,
    '{"promptKey": "curriculum.questions.mim_nun_spot_iqlab.prompt", "correctHighlight": "مِن بَ", "tokens": ["يَنقُضُونَ", "عَهْدَ", "اللَّهِ", "مِن بَعْدِ", "مِيثَاقِهِ"], "correctToken": "مِن بَعْدِ"}',
    1
  ),
  (
    'mim-nun-izhar-muthlaq-tf',
    'mim-nun-rules',
    'izhar-muthlaq',
    'true_false',
    2,
    'izhar-muthlaq',
    'ex-izhar-muthlaq-dunya',
    'tuhfatul-athfal',
    11,
    '{"promptKey": "curriculum.questions.mim_nun_izhar_muthlaq_tf.prompt", "correctBoolean": false, "explanationKey": "curriculum.questions.mim_nun_izhar_muthlaq_tf.explanation"}',
    1
  ),
  (
    'meeting-letters-ahattu',
    'meeting-letters',
    'mutajanisan',
    'multiple_choice',
    2,
    'mutajanisan',
    'ex-mutajanisan-tha-ta',
    'muqoddimah-jazariyyah',
    46,
    '{"promptKey": "curriculum.questions.meeting_letters_ahattu.prompt", "arabicFocus": "أَحَطتُ", "options": [{"id": "a", "textKey": "idgham_naqish"}, {"id": "b", "textKey": "idgham_kamil"}, {"id": "c", "textKey": "izhar_muthlaq"}], "correctOptionId": "a", "explanationKey": "curriculum.questions.meeting_letters_ahattu.explanation"}',
    1
  ),
  (
    'mad-rules-farq-spot',
    'mad-rules',
    'madd-farq',
    'spot_in_ayah',
    2,
    'madd-farq',
    'ex-madd-farq-dzakarain',
    NULL,
    NULL,
    '{"promptKey": "curriculum.questions.mad_rules_farq_spot.prompt", "correctToken": "ءآلذَّكَرَيْنِ", "expectedHarakat": 6}',
    1
  ),
  (
    'special-words-saktah-spot',
    'special-words',
    'saktat-hafs',
    'match_pairs',
    2,
    'saktah-wajibah',
    'ex-saktah-kahf',
    NULL,
    NULL,
    '{"promptKey": "curriculum.questions.special_words_saktah_spot.prompt", "pairs": [{"left": "Al-Kahf 18:1", "right": "عِوَجَا ۜ"}, {"left": "Yasin 36:52", "right": "مَّرْقَدِنَا ۜ"}, {"left": "Al-Qiyamah 75:27", "right": "مَنْ ۜ رَاقٍ"}, {"left": "Al-Muthaffifin 83:14", "right": "بَلْ ۜ رَانَ"}]}',
    1
  ),
  (
    'special-words-imalah-audio',
    'special-words',
    'imalah-majreha',
    'audio_guess',
    3,
    'imalah-majreha',
    'ex-imalah-majreha',
    NULL,
    NULL,
    '{"promptKey": "curriculum.questions.special_words_imalah_audio.prompt", "arabicTarget": "مَجْر۪يهَا", "options": ["imalah", "tashil", "isymam", "saktah"], "correctOption": "imalah"}',
    1
  ),
  (
    'seven-alifs-true-false',
    'seven-alifs',
    'alifat-sabah',
    'true_false',
    2,
    'alifat-sabah',
    'ex-alifat-ana',
    NULL,
    NULL,
    '{"promptKey": "curriculum.questions.seven_alifs_true_false.prompt", "correctBoolean": true, "explanationKey": "curriculum.questions.seven_alifs_true_false.explanation"}',
    1
  ),
  (
    'waqf-raum-isymam-match',
    'roum-ishmam',
    'waqf-raum',
    'match_pairs',
    3,
    'waqf-raum',
    NULL,
    'muqoddimah-jazariyyah',
    105,
    '{"promptKey": "curriculum.questions.waqf_raum_isymam_match.prompt", "pairs": [{"leftKey": "sukun_mahdh", "rightKey": "fathah_kasrah_dhammah"}, {"leftKey": "raum", "rightKey": "kasrah_dhammah_one_third_sound"}, {"leftKey": "isymam", "rightKey": "dhammah_silent_lip_rounding"}]}',
    1
  ),
  (
    'hamzat-wasl-fil-rule',
    'hamzat-wasl',
    'hamzat-wasl-fil',
    'complete_matan',
    2,
    'hamzat-wasl-fil',
    NULL,
    'muqoddimah-jazariyyah',
    101,
    '{"promptKey": "curriculum.questions.hamzat_wasl_fil_rule.prompt", "missingWord": "بِضَمْ", "choices": ["بِضَمْ", "بِكَسْرْ", "بِفَتْحْ", "بِسُكُونْ"], "explanationKey": "curriculum.questions.hamzat_wasl_fil_rule.explanation"}',
    1
  ),
  (
    'istiadah-taubah-modes',
    'istiadah-basmalah',
    'bidayah-taubah',
    'multiple_choice',
    1,
    'bidayah-taubah',
    'ex-istiadah-nahl',
    NULL,
    NULL,
    '{"promptKey": "curriculum.questions.istiadah_taubah_modes.prompt", "options": [{"id": "a", "textKey": "two_modes_without_basmalah"}, {"id": "b", "textKey": "four_modes_with_basmalah"}], "correctOptionId": "a"}',
    1
  ),
  (
    'miscellaneous-dhad-zha',
    'miscellaneous',
    'tamyiz-dhad-zha',
    'audio_guess',
    3,
    'tamyiz-dhad-zha',
    'ex-tahdzirat-dhad-zha-1',
    'muqoddimah-jazariyyah',
    52,
    '{"promptKey": "curriculum.questions.misc_dhad_zha_audio.prompt", "arabicTarget": "أَنقَضَ ظَهْرَكَ", "options": ["dhad_then_zha", "zha_then_dhad", "two_dhads", "two_zhas"], "correctOption": "dhad_then_zha"}',
    1
  )
) AS v(slug, topic_slug, unit_slug, question_type, difficulty, rule_slug, example_slug, source_slug, verse_number, question_data, sort_order)
LEFT JOIN taj_rules r ON r.slug = v.rule_slug
LEFT JOIN taj_examples e ON e.slug = v.example_slug
LEFT JOIN ref_sources rs ON rs.slug = v.source_slug
LEFT JOIN ref_verses rv ON rv.source_id = rs.id AND rv.verse_number = v.verse_number
ON CONFLICT (slug) DO UPDATE SET
  topic_slug    = EXCLUDED.topic_slug,
  unit_slug     = EXCLUDED.unit_slug,
  question_type = EXCLUDED.question_type,
  difficulty    = EXCLUDED.difficulty,
  rule_id       = EXCLUDED.rule_id,
  example_id    = EXCLUDED.example_id,
  verse_id      = EXCLUDED.verse_id,
  question_data = EXCLUDED.question_data,
  sort_order    = EXCLUDED.sort_order,
  updated_at    = CURRENT_TIMESTAMP;

COMMIT;
