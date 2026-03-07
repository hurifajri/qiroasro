import type {
  FriendSuggestion,
  Statistic,
} from '../../../_schemas/user-profile';

/**
 * Mock statistics data
 */
export const MOCK_STATISTICS: Statistic[] = [
  {
    id: 'streak',
    labelKey: 'day_streak',
    value: 3,
    icon: 'flame',
  },
  {
    id: 'xp',
    labelKey: 'total_xp',
    value: 91757,
    icon: 'zap',
  },
  {
    id: 'league',
    labelKey: 'current_league',
    value: `Maq'adu Sidq`,
    icon: 'shield',
  },
  {
    id: 'top3',
    labelKey: 'top_3_finishes',
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
    mutualFriendsCount: 0,
    isFollowing: false,
  },
  {
    id: '2',
    username: 'abdullah',
    displayName: 'Abdullah',
    avatarColorCode: 'sky_rose',
    mutualFriendsCount: 5,
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
