import type { FullLeaderboardEntry, League } from '../_schemas/leaderboard';

/**
 * Available leagues in order
 */
export const MOCK_LEAGUES: League[] = [
  { id: 'obsidian', nameKey: 'leagues.obsidian', emoji: '🪨' },
  { id: 'pearl', nameKey: 'leagues.pearl', emoji: '🤍' },
  { id: 'sapphire', nameKey: 'leagues.sapphire', emoji: '💎' },
  { id: 'ruby', nameKey: 'leagues.ruby', emoji: '❤️‍🔥' },
  { id: 'emerald', nameKey: 'leagues.emerald', emoji: '💚' },
  { id: 'diamond', nameKey: 'leagues.diamond', emoji: '🔷' },
];

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
    avatarBg: 'bg-amber-500',
  },
  {
    rank: 2,
    userId: 'user-2',
    name: 'Abdullah',
    xp: 2180,
    isCurrentUser: false,
    avatarBg: 'bg-sky-500',
  },
  {
    rank: 3,
    userId: 'user-3',
    name: 'Muhammad',
    xp: 2050,
    isCurrentUser: false,
    avatarBg: 'bg-rose-500',
  },
  {
    rank: 4,
    userId: 'user-4',
    name: 'Yusuf',
    xp: 1950,
    isCurrentUser: false,
    avatarBg: 'bg-violet-500',
  },
  {
    rank: 5,
    userId: 'user-5',
    name: 'Ibrahim',
    xp: 1920,
    isCurrentUser: false,
    avatarBg: 'bg-emerald-500',
  },
  {
    rank: 6,
    userId: 'user-6',
    name: 'Khadijah',
    xp: 1900,
    isCurrentUser: false,
    avatarBg: 'bg-pink-500',
  },
  {
    rank: 7,
    userId: 'current-user',
    name: 'Baba',
    xp: 1883,
    isCurrentUser: true,
    avatarBg: 'bg-primary',
  },
  {
    rank: 8,
    userId: 'user-7',
    name: 'Umar',
    xp: 1750,
    isCurrentUser: false,
    avatarBg: 'bg-teal-500',
  },
  {
    rank: 9,
    userId: 'user-8',
    name: 'Aisha',
    xp: 1680,
    isCurrentUser: false,
    avatarBg: 'bg-orange-500',
  },
  {
    rank: 10,
    userId: 'user-9',
    name: 'Bilal',
    xp: 1520,
    isCurrentUser: false,
    avatarBg: 'bg-indigo-500',
  },
];
