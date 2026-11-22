import type { NavItem, UserStatus } from '../_schemas/private';

export const ADD_FRIENDS_ITEMS = [
  {
    id: 'find',
    href: '/find-friends',
    iconName: 'Search',
    iconBgClass:
      'flex size-10 items-center justify-center rounded-full bg-muted',
    iconClass: 'size-5 text-muted-foreground',
    labelKey: 'add_friends.find',
  },
  {
    id: 'invite',
    href: '/invite-friends',
    iconName: 'UserPlus',
    iconBgClass:
      'flex size-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30',
    iconClass: 'size-5 text-emerald-600 dark:text-emerald-400',
    labelKey: 'add_friends.invite',
  },
];

/**
 * Mock navigation items
 */
export const MOCK_NAV_ITEMS: NavItem[] = [
  {
    id: 'learn',
    labelKey: 'nav.learn',
    iconName: 'House',
    href: '/learn',
    isActive: true,
  },
  {
    id: 'reference',
    labelKey: 'nav.reference',
    iconName: 'BookOpen',
    href: '/reference',
    isActive: false,
  },
  {
    id: 'practice',
    labelKey: 'nav.practice',
    iconName: 'Dumbbell',
    href: '/practice',
    isActive: false,
  },
  {
    id: 'leaderboard',
    labelKey: 'nav.leaderboard',
    iconName: 'Trophy',
    href: '/leaderboard',
    isActive: false,
  },
  {
    id: 'quests',
    labelKey: 'nav.quests',
    iconName: 'Gift',
    href: '/quests',
    isActive: false,
  },
  {
    id: 'shop',
    labelKey: 'nav.shop',
    iconName: 'Store',
    href: '/shop',
    isActive: false,
  },
  {
    id: 'profile',
    labelKey: 'nav.profile',
    iconName: 'User',
    href: '/profile/hurifajri',
    isActive: false,
  },
];

/**
 * Mock user statuses for sidebar
 */
export const MOCK_USER_STATUSES: UserStatus[] = [
  { emoji: '🎯', label: 'Focused' },
  { emoji: '📖', label: 'Learning' },
  { emoji: '🔥', label: 'On Fire' },
  { emoji: '💪', label: 'Determined' },
  { emoji: '🤲', label: 'Praying' },
  { emoji: '📚', label: 'Studying' },
  { emoji: '🌙', label: 'Night Owl' },
  { emoji: '☀️', label: 'Early Bird' },
  { emoji: '🏆', label: 'Champion' },
  { emoji: '🎓', label: 'Graduate' },
  { emoji: '🌟', label: 'Star' },
  { emoji: '🦉', label: 'Wise' },
];
