import type { FriendSuggestion } from '../../../_schemas/user-profile';

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
