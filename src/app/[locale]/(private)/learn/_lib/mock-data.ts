import type { Lesson, Unit } from '../_schemas/learn';

/**
 * Mock units data - organized by makhraj (articulation point)
 */
export const MOCK_UNITS: Unit[] = [
  // Section 1: Foundation
  {
    id: 1,
    sectionNumber: 1,
    unitNumber: 1,
    titleKey: 'units.jauf.title',
    descriptionKey: 'units.jauf.description',
    colorCode: 'rose',
    iconKey: 'heart',
  },
  {
    id: 2,
    sectionNumber: 1,
    unitNumber: 2,
    titleKey: 'units.halq.title',
    descriptionKey: 'units.halq.description',
    colorCode: 'orange',
    iconKey: 'circle',
  },
  // Section 2: Tongue Letters
  {
    id: 3,
    sectionNumber: 2,
    unitNumber: 1,
    titleKey: 'units.aqsha_lisan.title',
    descriptionKey: 'units.aqsha_lisan.description',
    colorCode: 'amber',
    iconKey: 'zap',
  },
  {
    id: 4,
    sectionNumber: 2,
    unitNumber: 2,
    titleKey: 'units.wasath_lisan.title',
    descriptionKey: 'units.wasath_lisan.description',
    colorCode: 'yellow',
    iconKey: 'star',
  },
  {
    id: 5,
    sectionNumber: 2,
    unitNumber: 3,
    titleKey: 'units.hafah_lisan.title',
    descriptionKey: 'units.hafah_lisan.description',
    colorCode: 'lime',
    iconKey: 'leaf',
  },
  {
    id: 6,
    sectionNumber: 2,
    unitNumber: 4,
    titleKey: 'units.tharaf_lisan.title',
    descriptionKey: 'units.tharaf_lisan.description',
    colorCode: 'green',
    iconKey: 'target',
  },
  {
    id: 7,
    sectionNumber: 2,
    unitNumber: 5,
    titleKey: 'units.tsanaya.title',
    descriptionKey: 'units.tsanaya.description',
    colorCode: 'emerald',
    iconKey: 'gem',
  },
  // Section 3: Lips & Nasal
  {
    id: 8,
    sectionNumber: 3,
    unitNumber: 1,
    titleKey: 'units.syafatain.title',
    descriptionKey: 'units.syafatain.description',
    colorCode: 'teal',
    iconKey: 'smile',
  },
  {
    id: 9,
    sectionNumber: 3,
    unitNumber: 2,
    titleKey: 'units.khaisyum.title',
    descriptionKey: 'units.khaisyum.description',
    colorCode: 'cyan',
    iconKey: 'wind',
  },
  // Section 4: Traits
  {
    id: 10,
    sectionNumber: 4,
    unitNumber: 1,
    titleKey: 'units.sifat_mutadhadah.title',
    descriptionKey: 'units.sifat_mutadhadah.description',
    colorCode: 'sky',
    iconKey: 'layers',
  },
  {
    id: 11,
    sectionNumber: 4,
    unitNumber: 2,
    titleKey: 'units.sifat_munfaridah.title',
    descriptionKey: 'units.sifat_munfaridah.description',
    colorCode: 'blue',
    iconKey: 'sparkles',
  },
];

/**
 * Mock lessons for Unit 1 (Huruf Jauf - Mad Letters)
 * Shows different lesson states for demo purposes
 */
export const MOCK_LESSONS: Lesson[] = [
  // Unit 1 - Huruf Jauf (completed lessons)
  {
    id: 1,
    unitId: 1,
    order: 1,
    type: 'lesson',
    status: 'completed',
    letterSymbol: 'ـَا',
    xpReward: 10,
    crowns: 5,
  },
  {
    id: 2,
    unitId: 1,
    order: 2,
    type: 'lesson',
    status: 'completed',
    letterSymbol: 'ـُو',
    xpReward: 10,
    crowns: 4,
  },
  {
    id: 3,
    unitId: 1,
    order: 3,
    type: 'practice',
    status: 'completed',
    xpReward: 15,
    crowns: 5,
  },
  {
    id: 4,
    unitId: 1,
    order: 4,
    type: 'lesson',
    status: 'in-progress',
    letterSymbol: 'ـِي',
    xpReward: 10,
    crowns: 0,
  },
  {
    id: 5,
    unitId: 1,
    order: 5,
    type: 'chest',
    status: 'locked',
    xpReward: 50,
    crowns: 0,
  },
  {
    id: 6,
    unitId: 1,
    order: 6,
    type: 'lesson',
    status: 'locked',
    xpReward: 10,
    crowns: 0,
  },
  {
    id: 7,
    unitId: 1,
    order: 7,
    type: 'trophy',
    status: 'locked',
    xpReward: 100,
    crowns: 0,
  },

  // Unit 2 - Huruf Halq (all locked)
  {
    id: 8,
    unitId: 2,
    order: 1,
    type: 'lesson',
    status: 'locked',
    letterSymbol: 'ء',
    xpReward: 10,
    crowns: 0,
  },
  {
    id: 9,
    unitId: 2,
    order: 2,
    type: 'lesson',
    status: 'locked',
    letterSymbol: 'ه',
    xpReward: 10,
    crowns: 0,
  },
  {
    id: 10,
    unitId: 2,
    order: 3,
    type: 'lesson',
    status: 'locked',
    letterSymbol: 'ع',
    xpReward: 10,
    crowns: 0,
  },
  {
    id: 11,
    unitId: 2,
    order: 4,
    type: 'practice',
    status: 'locked',
    xpReward: 15,
    crowns: 0,
  },
  {
    id: 12,
    unitId: 2,
    order: 5,
    type: 'lesson',
    status: 'locked',
    letterSymbol: 'ح',
    xpReward: 10,
    crowns: 0,
  },
  {
    id: 13,
    unitId: 2,
    order: 6,
    type: 'lesson',
    status: 'locked',
    letterSymbol: 'غ',
    xpReward: 10,
    crowns: 0,
  },
  {
    id: 14,
    unitId: 2,
    order: 7,
    type: 'lesson',
    status: 'locked',
    letterSymbol: 'خ',
    xpReward: 10,
    crowns: 0,
  },
  {
    id: 15,
    unitId: 2,
    order: 8,
    type: 'chest',
    status: 'locked',
    xpReward: 50,
    crowns: 0,
  },
  {
    id: 16,
    unitId: 2,
    order: 9,
    type: 'trophy',
    status: 'locked',
    xpReward: 100,
    crowns: 0,
  },
];

/**
 * Get lessons by unit ID
 */
export function getLessonsByUnitId(unitId: number): Lesson[] {
  return MOCK_LESSONS.filter((lesson) => lesson.unitId === unitId);
}

/**
 * Get current unit (first unit with available or in-progress lessons)
 */
export function getCurrentUnit(): Unit {
  return MOCK_UNITS[0];
}

/**
 * Get section title key
 */
export function getSectionTitleKey(sectionNumber: number): string {
  const sectionTitles: Record<number, string> = {
    1: 'sections.foundation',
    2: 'sections.tongue_letters',
    3: 'sections.lips_nasal',
    4: 'sections.trait',
  };
  return sectionTitles[sectionNumber] ?? 'sections.unknown';
}
