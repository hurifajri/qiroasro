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
    value: 'Obsidian',
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

/**
 * Mock achievements
 */
export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'wildfire',
    titleKey: 'wildfire.title',
    descriptionKey: 'wildfire.description',
    emojiColorCode: 'orange_red',
    emoji: '🔥',
    level: 1,
  },
  {
    id: 'wildfire2',
    titleKey: 'wildfire.title',
    descriptionKey: 'wildfire.description',
    emojiColorCode: 'orange_red',
    emoji: '🔥',
    level: 3,
  },
  {
    id: 'wildfire3',
    titleKey: 'wildfire.title',
    descriptionKey: 'wildfire.description',
    emojiColorCode: 'orange_red',
    emoji: '🔥',
    level: 10,
  },
];
