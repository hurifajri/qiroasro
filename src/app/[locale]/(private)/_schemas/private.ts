import type { AvatarColorCode } from '@/lib/avatar';

import type { LeagueNameKey } from './league';

export type { LeagueNameKey };

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

export interface NavItem {
  id: string;
  labelKey: string;
  iconName: string;
  href: string;
  isActive: boolean;
}

export interface UserStatus {
  emoji: string;
  label: string;
}

export interface ActivityFeedItem {
  id: string;
  userName: string;
  avatarColorCode?: AvatarColorCode;
  activityDate: string;
  descriptionKey: string;
  reactionEmojis: string[];
  reactionCount: number;
}

export interface FollowEntry {
  id: string;
  name: string;
  avatarColorCode?: AvatarColorCode;
  xp: number;
  isOnline: boolean;
}
