/**
 * Practice modes for Tajwid learning
 */
export interface PracticeMode {
  id: string;
  titleKey: string;
  descriptionKey: string;
  iconName: string;
  href: string;
  isPremium?: boolean;
  badge?: number;
  colorCode: 'rose' | 'emerald' | 'amber' | 'sky' | 'purple' | 'orange';
}

export interface PracticeSection {
  id: string;
  titleKey: string;
  modes: PracticeMode[];
}

export const PRACTICE_SECTIONS: PracticeSection[] = [
  {
    id: 'letters',
    titleKey: 'sections.letters',
    modes: [
      {
        id: 'articulation',
        titleKey: 'modes.articulation.title',
        descriptionKey: 'modes.articulation.description',
        iconName: 'Speech',
        href: '/practice/articulation',
        colorCode: 'orange',
      },
      {
        id: 'trait',
        titleKey: 'modes.trait.title',
        descriptionKey: 'modes.trait.description',
        iconName: 'Zap',
        href: '/practice/trait',
        colorCode: 'amber',
      },
    ],
  },
  {
    id: 'rules',
    titleKey: 'sections.rules',
    modes: [
      {
        id: 'rule',
        titleKey: 'modes.rule.title',
        descriptionKey: 'modes.rule.description',
        iconName: 'BookOpen',
        href: '/practice/rule',
        colorCode: 'emerald',
      },
      {
        id: 'listen',
        titleKey: 'modes.listen.title',
        descriptionKey: 'modes.listen.description',
        iconName: 'Headphones',
        href: '/practice/listen',
        badge: 125,
        colorCode: 'sky',
      },
    ],
  },
  {
    id: 'collections',
    titleKey: 'sections.collections',
    modes: [
      {
        id: 'mistakes',
        titleKey: 'modes.mistakes.title',
        descriptionKey: 'modes.mistakes.description',
        iconName: 'RefreshCw',
        href: '/practice/mistakes',
        badge: 12,
        colorCode: 'amber',
        isPremium: true,
      },
      {
        id: 'saved',
        titleKey: 'modes.saved.title',
        descriptionKey: 'modes.saved.description',
        iconName: 'Star',
        href: '/practice/saved',
        colorCode: 'purple',
      },
    ],
  },
];
