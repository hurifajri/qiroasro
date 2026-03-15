/**
 * Reference categories for the reference library landing page
 */
export interface ReferenceCategory {
  id: string;
  titleKey: string;
  subtitleKey: string;
  iconSymbol: string;
  href: string;
  available: boolean;
}

export const REFERENCE_CATEGORIES: ReferenceCategory[] = [
  {
    id: 'letters',
    titleKey: 'categories.letters.title',
    subtitleKey: 'categories.letters.subtitle',
    iconSymbol: '📖',
    href: '/reference/letters',
    available: true,
  },
  {
    id: 'articulation',
    titleKey: 'categories.articulation.title',
    subtitleKey: 'categories.articulation.subtitle',
    iconSymbol: '🗣️',
    href: '/reference/articulation',
    available: false, // Coming soon
  },
  {
    id: 'trait',
    titleKey: 'categories.trait.title',
    subtitleKey: 'categories.trait.subtitle',
    iconSymbol: '⚡',
    href: '/reference/trait',
    available: false, // Coming soon
  },
  {
    id: 'rule',
    titleKey: 'categories.rule.title',
    subtitleKey: 'categories.rule.subtitle',
    iconSymbol: '📐',
    href: '/reference/rule',
    available: false, // Coming soon
  },
  {
    id: 'waqf',
    titleKey: 'categories.waqf.title',
    subtitleKey: 'categories.waqf.subtitle',
    iconSymbol: '🚛',
    href: '/reference/waqf',
    available: false, // Coming soon
  },
];
