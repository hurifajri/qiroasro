import type { FullLeaderboardEntry } from '../_schemas/leaderboard';

/**
 * Full leaderboard entries (joined state)
 */
export const MOCK_FULL_LEADERBOARD: FullLeaderboardEntry[] = [
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
    rank: 4,
    userId: 'user-4',
    name: 'Yusuf',
    xp: 1950,
    isCurrentUser: false,
  },
  {
    rank: 5,
    userId: 'user-5',
    name: 'Ibrahim',
    xp: 1920,
    isCurrentUser: false,
  },
  {
    rank: 6,
    userId: 'user-6',
    name: 'Khadijah',
    xp: 1900,
    isCurrentUser: false,
  },
  {
    rank: 7,
    userId: 'current-user',
    name: 'Baba',
    xp: 1883,
    isCurrentUser: true,
  },
  {
    rank: 8,
    userId: 'user-7',
    name: 'Umar',
    xp: 1750,
    isCurrentUser: false,
  },
  {
    rank: 9,
    userId: 'user-8',
    name: 'Aisha',
    xp: 1680,
    isCurrentUser: false,
  },
  {
    rank: 10,
    userId: 'user-9',
    name: 'Bilal',
    xp: 1520,
    isCurrentUser: false,
  },
];
