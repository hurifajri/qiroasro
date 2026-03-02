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
    id: 'articulation',
    titleKey: 'categories.articulation.title',
    countKey: 'categories.articulation.count',
    iconSymbol: '🗣️',
    href: '/reference/articulation',
    available: false, // Coming soon
  },
  {
    id: 'trait',
    titleKey: 'categories.trait.title',
    countKey: 'categories.trait.count',
    iconSymbol: '⚡',
    href: '/reference/trait',
    available: false, // Coming soon
  },
  {
    id: 'rule',
    titleKey: 'categories.rule.title',
    countKey: 'categories.rule.count',
    iconSymbol: '📐',
    href: '/reference/rule',
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
