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
  username: 'hurifajri',
  displayName: 'Baba Huri Haura',
  avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Baba%20Huri',
  joinedDate: '2021-06-01',
  followingCount: 19,
  followersCount: 52,
};

/**
 * Mock statistics data
 */
export const MOCK_STATISTICS: Statistic[] = [
  {
    id: 'streak',
    label: 'Day streak',
    value: 0,
    icon: 'flame',
  },
  {
    id: 'xp',
    label: 'Total XP',
    value: 91757,
    icon: 'zap',
  },
  {
    id: 'league',
    label: 'Current league',
    value: 0,
    icon: 'shield',
  },
  {
    id: 'top3',
    label: 'Top 3 finishes',
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
    displayName: 'Muhammad',
    avatarUrl:
      'https://api.dicebear.com/7.x/initials/svg?seed=M&backgroundColor=60a5fa',
    mutualFriendsCount: 3,
    isFollowing: 'false',
  },
  {
    id: '2',
    username: 'eunice',
    displayName: 'Eunice é',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eunice',
    mutualFriendsCount: 3,
    isFollowing: 'false',
  },
  {
    id: '3',
    username: 'nhat',
    displayName: 'Nhật',
    avatarUrl:
      'https://api.dicebear.com/7.x/initials/svg?seed=N&backgroundColor=84cc16',
    mutualFriendsCount: 3,
    isFollowing: 'true',
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
