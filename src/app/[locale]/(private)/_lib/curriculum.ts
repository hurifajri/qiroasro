/**
 * Unified curriculum definition — single source of truth for:
 * - Reference page (24 topics)
 * - Sections page (24 sections)
 * - Learn page (units + lessons per section)
 */

import type { CardColorCode } from '@/lib/colors';

export const LESSON_TYPES = ['quiz', 'trophy'] as const;
export type LessonType = (typeof LESSON_TYPES)[number];

export const QUIZ_SOURCES = ['relational', 'authored'] as const;
export type QuizSource = (typeof QUIZ_SOURCES)[number];

export interface CurriculumLesson {
  /** Lesson type: quiz session or trophy (unit completion marker) */
  type: LessonType;
  /** Quiz source — only for type 'quiz' */
  quizSource?: QuizSource;
  /** Arabic letter symbol displayed on the lesson node, if applicable */
  letterSymbol?: string;
  /** Current progress status — defaults to 'available' when not set */
  status?: 'locked' | 'available' | 'in-progress' | 'completed';
}

export interface CurriculumUnit {
  /** Kebab-case English identifier, used as URL slug */
  slug: string;
  /** i18n key → learn_page.units.{key}.title */
  titleKey: string;
  /** i18n key → learn_page.units.{key}.description */
  descriptionKey: string;
  /** Tailwind color token (e.g. 'rose', 'blue', 'emerald') */
  colorCode: CardColorCode;
  /** Lucide icon name */
  iconKey: string;
  lessons: CurriculumLesson[];
}

export interface CurriculumTopic {
  /** Kebab-case English identifier, used as URL slug */
  slug: string;
  sortOrder: number;
  /** Whether MDX content is ready for this topic */
  available: boolean;
  href: string;
  /** i18n key → reference_page.categories.{key}.title */
  titleKey: string;
  /** i18n key → reference_page.categories.{key}.subtitle */
  subtitleKey: string;
  iconSymbol: string;
  units: CurriculumUnit[];
}

/**
 * Fixed number of questions per quiz lesson.
 * Keeping this constant ensures a predictable experience for the learner.
 */
export const QUESTIONS_PER_LESSON = 5;

export const CURRICULUM_TOPICS: CurriculumTopic[] = [
  {
    slug: 'noble-quran',
    sortOrder: 1,
    available: true,
    href: `/reference/noble-quran`,
    titleKey: 'reference_page.categories.noble_quran.title',
    subtitleKey: 'reference_page.categories.noble_quran.subtitle',
    iconSymbol: '📖',
    units: [
      {
        slug: 'quran-delivery-method',
        titleKey: 'learn_page.units.quran_delivery_method.title',
        descriptionKey: 'learn_page.units.quran_delivery_method.description',
        colorCode: 'sky',
        iconKey: 'book-open',
        lessons: [{ type: 'quiz', quizSource: 'authored' }, { type: 'trophy' }],
      },
      {
        slug: 'mutawatir-definition',
        titleKey: 'learn_page.units.mutawatir_definition.title',
        descriptionKey: 'learn_page.units.mutawatir_definition.description',
        colorCode: 'lime',
        iconKey: 'link',
        lessons: [{ type: 'quiz', quizSource: 'authored' }, { type: 'trophy' }],
      },
      {
        slug: 'oral-transmission-process',
        titleKey: 'learn_page.units.oral_transmission_process.title',
        descriptionKey:
          'learn_page.units.oral_transmission_process.description',
        colorCode: 'violet',
        iconKey: 'mic',
        lessons: [{ type: 'quiz', quizSource: 'authored' }, { type: 'trophy' }],
      },
      {
        slug: 'quran-codification',
        titleKey: 'learn_page.units.quran_codification.title',
        descriptionKey: 'learn_page.units.quran_codification.description',
        colorCode: 'rose',
        iconKey: 'scroll',
        lessons: [{ type: 'quiz', quizSource: 'authored' }, { type: 'trophy' }],
      },
    ],
  },
  {
    slug: 'tajweed-science',
    sortOrder: 2,
    available: false,
    href: `/reference/tajweed-science`,
    titleKey: 'reference_page.categories.tajweed_science.title',
    subtitleKey: 'reference_page.categories.tajweed_science.subtitle',
    iconSymbol: '📚',
    units: [],
  },
  {
    slug: 'istiadah-basmalah',
    sortOrder: 3,
    available: false,
    href: `/reference/istiadah-basmalah`,
    titleKey: 'reference_page.categories.istiadah_basmalah.title',
    subtitleKey: 'reference_page.categories.istiadah_basmalah.subtitle',
    iconSymbol: '🤲',
    units: [],
  },
  {
    slug: 'arabic-letters',
    sortOrder: 4,
    available: false,
    href: `/reference/arabic-letters`,
    titleKey: 'reference_page.categories.arabic_letters.title',
    subtitleKey: 'reference_page.categories.arabic_letters.subtitle',
    iconSymbol: '🔠',
    units: [],
  },
  {
    slug: 'vocal-organs',
    sortOrder: 5,
    available: false,
    href: `/reference/vocal-organs`,
    titleKey: 'reference_page.categories.vocal_organs.title',
    subtitleKey: 'reference_page.categories.vocal_organs.subtitle',
    iconSymbol: '🗣️',
    units: [],
  },
  {
    slug: 'articulation-points',
    sortOrder: 6,
    available: true,
    href: `/reference/articulation-points`,
    titleKey: 'reference_page.categories.articulation_points.title',
    subtitleKey: 'reference_page.categories.articulation_points.subtitle',
    iconSymbol: '📍',
    units: [
      {
        slug: 'jauf',
        titleKey: 'learn_page.units.jauf.title',
        descriptionKey: 'learn_page.units.jauf.description',
        colorCode: 'blue',
        iconKey: 'wind',
        lessons: [
          { type: 'quiz', quizSource: 'relational' },
          { type: 'trophy' },
        ],
      },
      {
        slug: 'halq',
        titleKey: 'learn_page.units.halq.title',
        descriptionKey: 'learn_page.units.halq.description',
        colorCode: 'blue',
        iconKey: 'waves',
        lessons: [
          { type: 'quiz', quizSource: 'relational' },
          { type: 'trophy' },
        ],
      },
      {
        slug: 'aqsha-lisan-fauq',
        titleKey: 'learn_page.units.aqsha_lisan_fauq.title',
        descriptionKey: 'learn_page.units.aqsha_lisan_fauq.description',
        colorCode: 'blue',
        iconKey: 'move-up',
        lessons: [
          { type: 'quiz', quizSource: 'relational' },
          { type: 'trophy' },
        ],
      },
      {
        slug: 'wasath-lisan',
        titleKey: 'learn_page.units.wasath_lisan.title',
        descriptionKey: 'learn_page.units.wasath_lisan.description',
        colorCode: 'blue',
        iconKey: 'minus',
        lessons: [
          { type: 'quiz', quizSource: 'relational' },
          { type: 'trophy' },
        ],
      },
      {
        slug: 'hafah-lisan-adhras',
        titleKey: 'learn_page.units.hafah_lisan_adhras.title',
        descriptionKey: 'learn_page.units.hafah_lisan_adhras.description',
        colorCode: 'blue',
        iconKey: 'sliders-horizontal',
        lessons: [
          { type: 'quiz', quizSource: 'relational' },
          { type: 'trophy' },
        ],
      },
      {
        slug: 'tharaf-lisan-taht',
        titleKey: 'learn_page.units.tharaf_lisan_taht.title',
        descriptionKey: 'learn_page.units.tharaf_lisan_taht.description',
        colorCode: 'blue',
        iconKey: 'locate',
        lessons: [
          { type: 'quiz', quizSource: 'relational' },
          { type: 'trophy' },
        ],
      },
      {
        slug: 'tsanaya',
        titleKey: 'learn_page.units.tsanaya.title',
        descriptionKey: 'learn_page.units.tsanaya.description',
        colorCode: 'blue',
        iconKey: 'smile',
        lessons: [
          { type: 'quiz', quizSource: 'relational' },
          { type: 'trophy' },
        ],
      },
      {
        slug: 'syafatain',
        titleKey: 'learn_page.units.syafatain.title',
        descriptionKey: 'learn_page.units.syafatain.description',
        colorCode: 'blue',
        iconKey: 'circle',
        lessons: [
          { type: 'quiz', quizSource: 'relational' },
          { type: 'trophy' },
        ],
      },
      {
        slug: 'khaisyum',
        titleKey: 'learn_page.units.khaisyum.title',
        descriptionKey: 'learn_page.units.khaisyum.description',
        colorCode: 'blue',
        iconKey: 'wind',
        lessons: [
          { type: 'quiz', quizSource: 'relational' },
          { type: 'trophy' },
        ],
      },
    ],
  },
  {
    slug: 'letter-characteristics',
    sortOrder: 7,
    available: false,
    href: `/reference/letter-characteristics`,
    titleKey: 'reference_page.categories.letter_characteristics.title',
    subtitleKey: 'reference_page.categories.letter_characteristics.subtitle',
    iconSymbol: '⚡',
    units: [
      {
        slug: 'sifat-mutadhadah',
        titleKey: 'learn_page.units.sifat_mutadhadah.title',
        descriptionKey: 'learn_page.units.sifat_mutadhadah.description',
        colorCode: 'purple',
        iconKey: 'zap',
        lessons: [
          { type: 'quiz', quizSource: 'relational' },
          { type: 'trophy' },
        ],
      },
      {
        slug: 'sifat-munfaridah',
        titleKey: 'learn_page.units.sifat_munfaridah.title',
        descriptionKey: 'learn_page.units.sifat_munfaridah.description',
        colorCode: 'purple',
        iconKey: 'sparkles',
        lessons: [
          { type: 'quiz', quizSource: 'relational' },
          { type: 'trophy' },
        ],
      },
    ],
  },
  {
    slug: 'common-mistakes',
    sortOrder: 8,
    available: false,
    href: `/reference/common-mistakes`,
    titleKey: 'reference_page.categories.common_mistakes.title',
    subtitleKey: 'reference_page.categories.common_mistakes.subtitle',
    iconSymbol: '⚠️',
    units: [],
  },
  {
    slug: 'meeting-letters',
    sortOrder: 9,
    available: false,
    href: `/reference/meeting-letters`,
    titleKey: 'reference_page.categories.meeting_letters.title',
    subtitleKey: 'reference_page.categories.meeting_letters.subtitle',
    iconSymbol: '🤝',
    units: [],
  },
  {
    slug: 'mim-nun-rules',
    sortOrder: 10,
    available: false,
    href: `/reference/mim-nun-rules`,
    titleKey: 'reference_page.categories.mim_nun_rules.title',
    subtitleKey: 'reference_page.categories.mim_nun_rules.subtitle',
    iconSymbol: '⚖️',
    units: [],
  },
  {
    slug: 'mad-rules',
    sortOrder: 11,
    available: false,
    href: `/reference/mad-rules`,
    titleKey: 'reference_page.categories.mad_rules.title',
    subtitleKey: 'reference_page.categories.mad_rules.subtitle',
    iconSymbol: '〰️',
    units: [],
  },
  {
    slug: 'vowel-completion',
    sortOrder: 12,
    available: false,
    href: `/reference/vowel-completion`,
    titleKey: 'reference_page.categories.vowel_completion.title',
    subtitleKey: 'reference_page.categories.vowel_completion.subtitle',
    iconSymbol: '🎯',
    units: [],
  },
  {
    slug: 'meeting-sukoons',
    sortOrder: 13,
    available: false,
    href: `/reference/meeting-sukoons`,
    titleKey: 'reference_page.categories.meeting_sukoons.title',
    subtitleKey: 'reference_page.categories.meeting_sukoons.subtitle',
    iconSymbol: '⏸️',
    units: [],
  },
  {
    slug: 'miscellaneous',
    sortOrder: 14,
    available: false,
    href: `/reference/miscellaneous`,
    titleKey: 'reference_page.categories.miscellaneous.title',
    subtitleKey: 'reference_page.categories.miscellaneous.subtitle',
    iconSymbol: '🧩',
    units: [],
  },
  {
    slug: 'nabr',
    sortOrder: 15,
    available: false,
    href: `/reference/nabr`,
    titleKey: 'reference_page.categories.nabr.title',
    subtitleKey: 'reference_page.categories.nabr.subtitle',
    iconSymbol: '📈',
    units: [],
  },
  {
    slug: 'special-words',
    sortOrder: 16,
    available: false,
    href: `/reference/special-words`,
    titleKey: 'reference_page.categories.special_words.title',
    subtitleKey: 'reference_page.categories.special_words.subtitle',
    iconSymbol: '⭐',
    units: [],
  },
  {
    slug: 'waqf-ibtida',
    sortOrder: 17,
    available: false,
    href: `/reference/waqf-ibtida`,
    titleKey: 'reference_page.categories.waqf_ibtida.title',
    subtitleKey: 'reference_page.categories.waqf_ibtida.subtitle',
    iconSymbol: '🛑',
    units: [],
  },
  {
    slug: 'roum-ishmam',
    sortOrder: 18,
    available: false,
    href: `/reference/roum-ishmam`,
    titleKey: 'reference_page.categories.roum_ishmam.title',
    subtitleKey: 'reference_page.categories.roum_ishmam.subtitle',
    iconSymbol: '🤏',
    units: [],
  },
  {
    slug: 'seven-alifs',
    sortOrder: 19,
    available: false,
    href: `/reference/seven-alifs`,
    titleKey: 'reference_page.categories.seven_alifs.title',
    subtitleKey: 'reference_page.categories.seven_alifs.subtitle',
    iconSymbol: '7️⃣',
    units: [],
  },
  {
    slug: 'hamzat-wasl',
    sortOrder: 20,
    available: false,
    href: `/reference/hamzat-wasl`,
    titleKey: 'reference_page.categories.hamzat_wasl.title',
    subtitleKey: 'reference_page.categories.hamzat_wasl.subtitle',
    iconSymbol: '🔗',
    units: [],
  },
  {
    slug: 'hamzat-qata',
    sortOrder: 21,
    available: false,
    href: `/reference/hamzat-qata`,
    titleKey: 'reference_page.categories.hamzat_qata.title',
    subtitleKey: 'reference_page.categories.hamzat_qata.subtitle',
    iconSymbol: '✂️',
    units: [],
  },
  {
    slug: 'mushaf-signs',
    sortOrder: 22,
    available: false,
    href: `/reference/mushaf-signs`,
    titleKey: 'reference_page.categories.mushaf_signs.title',
    subtitleKey: 'reference_page.categories.mushaf_signs.subtitle',
    iconSymbol: '📝',
    units: [],
  },
  {
    slug: 'modern-spelling',
    sortOrder: 23,
    available: false,
    href: `/reference/modern-spelling`,
    titleKey: 'reference_page.categories.modern_spelling.title',
    subtitleKey: 'reference_page.categories.modern_spelling.subtitle',
    iconSymbol: '🔤',
    units: [],
  },
  {
    slug: 'memorization',
    sortOrder: 24,
    available: false,
    href: `/reference/memorization`,
    titleKey: 'reference_page.categories.memorization.title',
    subtitleKey: 'reference_page.categories.memorization.subtitle',
    iconSymbol: '🧠',
    units: [],
  },
];
