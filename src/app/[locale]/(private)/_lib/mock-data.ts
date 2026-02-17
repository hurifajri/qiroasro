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
  league: 'honor',
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
    avatarColorCode: 'amber',
    activityDate: '2026-02-16T00:30:00.000Z',
    descriptionKey: 'activity.completed_streak',
    reactionEmojis: ['🎉'],
    reactionCount: 2,
  },
  {
    id: '2',
    userName: 'W',
    avatarColorCode: 'rose',
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
    name: 'Hajar Haura',
    avatarColorCode: 'rose_violet',
    xp: 1566566,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Nurul Huriyyah',
    avatarColorCode: 'amber',
    xp: 606236,
    isOnline: false,
  },
  {
    id: '3',
    name: `Rifa'atul Mahmudah`,
    avatarColorCode: 'teal',
    xp: 130976,
    isOnline: false,
  },
];

/**
 * Mock followers list
 */
export const MOCK_FOLLOWERS: FollowEntry[] = [
  {
    id: '1',
    name: 'Ahmad',
    avatarColorCode: 'sky',
    xp: 245000,
    isOnline: false,
  },
  {
    id: '2',
    name: 'Abdullah',
    avatarColorCode: 'amber',
    xp: 218000,
    isOnline: true,
  },
  {
    id: '3',
    name: 'Muhammad',
    avatarColorCode: 'violet',
    xp: 205000,
    isOnline: true,
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
    emoji: '🌹',
    emojiColorCode: 'rose_pink',
  },
  {
    id: 2,
    titleKey: 'badges.duos_frozen_winter.title',
    dateKey: 'badges.duos_frozen_winter.date',
    emoji: '❄️',
    emojiColorCode: 'sky_blue',
  },
  {
    id: 3,
    titleKey: 'badges.oscars_ode_to_botticelli.title',
    dateKey: 'badges.oscars_ode_to_botticelli.date',
    emoji: '🎨',
    emojiColorCode: 'blue_indigo',
  },
  {
    id: 4,
    titleKey: 'badges.duocon_2024.title',
    dateKey: 'badges.duocon_2024.date',
    emoji: '🎯',
    emojiColorCode: 'indigo_violet',
  },
  {
    id: 5,
    titleKey: 'badges.summer_owlympics.title',
    dateKey: 'badges.summer_owlympics.date',
    emoji: '🏅',
    emojiColorCode: 'emerald_teal',
  },
];
