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
  color: 'primary' | 'emerald' | 'amber' | 'sky' | 'purple';
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
        id: 'makharij',
        titleKey: 'modes.makharij.title',
        descriptionKey: 'modes.makharij.description',
        iconName: 'Speech',
        href: '/practice/makharij',
        color: 'primary',
      },
      {
        id: 'sifaat',
        titleKey: 'modes.sifaat.title',
        descriptionKey: 'modes.sifaat.description',
        iconName: 'Zap',
        href: '/practice/sifaat',
        color: 'amber',
      },
    ],
  },
  {
    id: 'rules',
    titleKey: 'sections.rules',
    modes: [
      {
        id: 'ahkam',
        titleKey: 'modes.ahkam.title',
        descriptionKey: 'modes.ahkam.description',
        iconName: 'BookOpen',
        href: '/practice/ahkam',
        color: 'emerald',
      },
      {
        id: 'listen',
        titleKey: 'modes.listen.title',
        descriptionKey: 'modes.listen.description',
        iconName: 'Headphones',
        href: '/practice/listen',
        color: 'sky',
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
        color: 'amber',
        isPremium: true,
      },
      {
        id: 'saved',
        titleKey: 'modes.saved.title',
        descriptionKey: 'modes.saved.description',
        iconName: 'Star',
        href: '/practice/saved',
        color: 'purple',
      },
    ],
  },
];
