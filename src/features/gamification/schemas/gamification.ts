import type { userXpLedger } from '@/db/gamification-schema';
import type { AvatarColorCode } from '@/lib/avatar';

import type { LeagueNameKey } from './league';

export type XpLedgerEntry = typeof userXpLedger.$inferSelect;

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  hearts: number;
  gems: number;
  leagueNameKey: LeagueNameKey;
  leagueRank: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  xp: number;
  avatarColorCode?: AvatarColorCode;
  isCurrentUser: boolean;
}

export interface Quest {
  id: number;
  titleKey: string;
  descriptionKey: string;
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
  iconType: 'xp' | 'accuracy' | 'streak' | 'lessons';
}

export interface Statistic {
  id: string;
  labelKey: string;
  value: string | number;
  icon: string;
}
