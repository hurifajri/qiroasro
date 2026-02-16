import type {
  Achievement,
  FriendSuggestion,
  Statistic,
  UserProfile,
} from '../_schemas/profile';

/**
 * Mock user profile data
 */
export const MOCK_USER_PROFILE: UserProfile = {
  username: 'fajri',
  displayName: 'Baba Huri Haura',
  avatarColorCode: 'indigo',
  joinedDate: '2026-02-15T00:00:00.000Z',
  followingCount: 19,
  followersCount: 52,
};

/**
 * Mock statistics data
 */
export const MOCK_STATISTICS: Statistic[] = [
  {
    id: 'streak',
    labelKey: 'stats.day_streak',
    value: 0,
    icon: 'flame',
  },
  {
    id: 'xp',
    labelKey: 'stats.total_xp',
    value: 91757,
    icon: 'zap',
  },
  {
    id: 'league',
    labelKey: 'stats.current_league',
    value: 0,
    icon: 'shield',
  },
  {
    id: 'top3',
    labelKey: 'stats.top_3_finishes',
    value: 16,
    icon: 'trophy',
  },
];

/**
 * Mock friend suggestions
 */
export const MOCK_FRIEND_SUGGESTIONS: FriendSuggestion[] = [
  {
    id: '1',
    username: 'mfajri',
    displayName: 'Muhammad Fajri',
    avatarColorCode: 'sky',
    mutualFriendsCount: 3,
    isFollowing: false,
  },
  {
    id: '2',
    username: 'abdullah',
    displayName: 'Abdullah',
    avatarColorCode: 'sky_rose',
    mutualFriendsCount: 3,
    isFollowing: false,
  },
  {
    id: '3',
    username: 'ibrahim',
    displayName: 'Ibrahim',
    avatarColorCode: 'emerald',
    mutualFriendsCount: 3,
    isFollowing: true,
  },
];

/**
 * Mock achievements
 */
export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'wildfire',
    titleKey: 'achievement_data.wildfire.title',
    descriptionKey: 'achievement_data.wildfire.description',
    iconBg: 'bg-gradient-to-br from-orange-400 to-red-500',
    iconEmoji: '🔥',
    level: 10,
  },
];
