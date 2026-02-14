import type {
  ActivityFeedItem,
  FollowEntry,
} from '../_schemas/profile-sidebar';

/**
 * Mock activity feed items
 */
export const MOCK_ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: '1',
    userName: 'Bagus Brahmantya',
    avatarUrl:
      'https://api.dicebear.com/7.x/initials/svg?seed=BB&backgroundColor=f59e0b',
    timeAgo: '40 mins',
    descriptionKey: 'activity.completed_streak',
    reactionEmojis: ['🎉'],
    reactionCount: 2,
  },
  {
    id: '2',
    userName: 'W',
    avatarUrl:
      'https://api.dicebear.com/7.x/initials/svg?seed=W&backgroundColor=ec4899',
    timeAgo: '1 day',
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
