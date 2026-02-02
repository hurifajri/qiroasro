/**
 * Reference categories for the reference library landing page
 */
export interface ReferenceCategory {
  id: string;
  titleKey: string;
  countKey: string;
  iconSymbol: string;
  href: string;
  available: boolean;
}

export const REFERENCE_CATEGORIES: ReferenceCategory[] = [
  {
    id: 'letters',
    titleKey: 'categories.letters.title',
    countKey: 'categories.letters.count',
    iconSymbol: '📖',
    href: '/reference/letters',
    available: true,
  },
  {
    id: 'makharij',
    titleKey: 'categories.makharij.title',
    countKey: 'categories.makharij.count',
    iconSymbol: '🗣️',
    href: '/reference/makharij',
    available: false, // Coming soon
  },
  {
    id: 'sifaat',
    titleKey: 'categories.sifaat.title',
    countKey: 'categories.sifaat.count',
    iconSymbol: '⚡',
    href: '/reference/sifaat',
    available: false, // Coming soon
  },
  {
    id: 'ahkam',
    titleKey: 'categories.ahkam.title',
    countKey: 'categories.ahkam.count',
    iconSymbol: '📐',
    href: '/reference/ahkam',
    available: false, // Coming soon
  },
  {
    id: 'waqf',
    titleKey: 'categories.waqf.title',
    countKey: 'categories.waqf.count',
    iconSymbol: '🚛',
    href: '/reference/waqf',
    available: false, // Coming soon
  },
];
