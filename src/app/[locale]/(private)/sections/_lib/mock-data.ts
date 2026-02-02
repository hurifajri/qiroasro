import type { Section } from '../_schemas/sections';

/**
 * Mock sections data - corresponds to curriculum sections
 */
export const MOCK_SECTIONS: Section[] = [
  {
    id: 1,
    number: 1,
    titleKey: 'sections.foundation.title',
    descriptionKey: 'sections.foundation.description',
    progress: 100,
    status: 'completed',
    totalUnits: 2,
    completedUnits: 2,
    color: 'rose',
  },
  {
    id: 2,
    number: 2,
    titleKey: 'sections.tongue_letters.title',
    descriptionKey: 'sections.tongue_letters.description',
    progress: 100,
    status: 'completed',
    totalUnits: 5,
    completedUnits: 5,
    color: 'amber',
  },
  {
    id: 3,
    number: 3,
    titleKey: 'sections.lips_nasal.title',
    descriptionKey: 'sections.lips_nasal.description',
    progress: 100,
    status: 'completed',
    totalUnits: 2,
    completedUnits: 2,
    color: 'teal',
  },
  {
    id: 4,
    number: 4,
    titleKey: 'sections.trait.title',
    descriptionKey: 'sections.trait.description',
    progress: 67,
    status: 'in-progress',
    totalUnits: 2,
    completedUnits: 1,
    color: 'sky',
  },
  {
    id: 5,
    number: 5,
    titleKey: 'sections.advanced.title',
    descriptionKey: 'sections.advanced.description',
    progress: 0,
    status: 'locked',
    totalUnits: 3,
    completedUnits: 0,
    color: 'purple',
  },
];
