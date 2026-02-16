import type {
  ActivityFeedItem,
  FollowEntry,
  LeaderboardEntry,
  MonthlyBadge,
  NavItem,
  Quest,
  UserStats,
  UserStatus,
} from '../_schemas/private';

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
 * Mock user stats
 */
export const MOCK_USER_STATS: UserStats = {
  xp: 1883,
  level: 12,
  streak: 5,
  hearts: 5,
  gems: 129,
  league: 'obsidian',
  leagueRank: 7,
};

/**
 * Mock daily quests
 */
export const MOCK_QUESTS: Quest[] = [
  {
    id: 1,
    titleKey: 'quests.earn_xp.title',
    descriptionKey: 'quests.earn_xp.description',
    target: 10,
    current: 0,
    xpReward: 5,
    completed: false,
    iconType: 'xp',
  },
  {
    id: 2,
    titleKey: 'quests.high_accuracy.title',
    descriptionKey: 'quests.high_accuracy.description',
    target: 1,
    current: 0,
    xpReward: 10,
    completed: false,
    iconType: 'accuracy',
  },
  {
    id: 3,
    titleKey: 'quests.complete_lessons.title',
    descriptionKey: 'quests.complete_lessons.description',
    target: 3,
    current: 1,
    xpReward: 15,
    completed: false,
    iconType: 'lessons',
  },
];

/**
 * Mock leaderboard entries
 */
export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'user-1',
    name: 'Ahmad',
    xp: 2450,
    isCurrentUser: false,
  },
  {
    rank: 2,
    userId: 'user-2',
    name: 'Abdullah',
    xp: 2180,
    isCurrentUser: false,
  },
  {
    rank: 3,
    userId: 'user-3',
    name: 'Muhammad',
    xp: 2050,
    isCurrentUser: false,
  },
  {
    rank: 7,
    userId: 'current-user',
    name: 'Anda',
    xp: 1883,
    isCurrentUser: true,
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

/**
 * Mock activity feed items
 */
export const MOCK_ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: '1',
    userName: 'Bagus Brahmantya',
    avatarUrl:
      'https://api.dicebear.com/7.x/initials/svg?seed=BB&backgroundColor=f59e0b',
    activityDate: '2026-02-16T00:30:00.000Z',
    descriptionKey: 'activity.completed_streak',
    reactionEmojis: ['🎉'],
    reactionCount: 2,
  },
  {
    id: '2',
    userName: 'W',
    avatarUrl:
      'https://api.dicebear.com/7.x/initials/svg?seed=W&backgroundColor=ec4899',
    activityDate: '2026-02-15T01:00:00.000Z',
    descriptionKey: 'activity.collected_badge',
    reactionEmojis: ['🎉', '😊'],
    reactionCount: 5,
  },
];

/**
 * Mock following list
 */
export const MOCK_FOLLOWING: FollowEntry[] = [
  {
    id: '1',
    name: 'W',
    avatarUrl:
      'https://api.dicebear.com/7.x/initials/svg?seed=W&backgroundColor=ec4899',
    xp: 1566566,
  },
  {
    id: '2',
    name: 'Bagus Brahmantya',
    avatarUrl:
      'https://api.dicebear.com/7.x/initials/svg?seed=BB&backgroundColor=f59e0b',
    xp: 606236,
  },
  {
    id: '3',
    name: 'Sylham S',
    avatarUrl:
      'https://api.dicebear.com/7.x/initials/svg?seed=SS&backgroundColor=84cc16',
    xp: 130976,
  },
];

/**
 * Mock followers list
 */
export const MOCK_FOLLOWERS: FollowEntry[] = [
  {
    id: '1',
    name: 'Ahmad',
    avatarUrl:
      'https://api.dicebear.com/7.x/initials/svg?seed=A&backgroundColor=3b82f6',
    xp: 245000,
  },
  {
    id: '2',
    name: 'Abdullah',
    avatarUrl:
      'https://api.dicebear.com/7.x/initials/svg?seed=AB&backgroundColor=f59e0b',
    xp: 218000,
  },
  {
    id: '3',
    name: 'Muhammad',
    avatarUrl:
      'https://api.dicebear.com/7.x/initials/svg?seed=M&backgroundColor=8b5cf6',
    xp: 205000,
  },
];

/**
 * Mock monthly badges
 */
export const MOCK_MONTHLY_BADGES: MonthlyBadge[] = [
  {
    id: 1,
    titleKey: 'badges.oscars_final_rose.title',
    dateKey: 'badges.oscars_final_rose.date',
    iconEmoji: '🌹',
    iconBg: 'bg-rose-100 dark:bg-rose-900/30',
  },
  {
    id: 2,
    titleKey: 'badges.duos_frozen_winter.title',
    dateKey: 'badges.duos_frozen_winter.date',
    iconEmoji: '❄️',
    iconBg: 'bg-sky-100 dark:bg-sky-900/30',
  },
  {
    id: 3,
    titleKey: 'badges.oscars_ode_to_botticelli.title',
    dateKey: 'badges.oscars_ode_to_botticelli.date',
    iconEmoji: '🎨',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    id: 4,
    titleKey: 'badges.duocon_2024.title',
    dateKey: 'badges.duocon_2024.date',
    iconEmoji: '🎯',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  {
    id: 5,
    titleKey: 'badges.summer_owlympics.title',
    dateKey: 'badges.summer_owlympics.date',
    iconEmoji: '🏅',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
];
