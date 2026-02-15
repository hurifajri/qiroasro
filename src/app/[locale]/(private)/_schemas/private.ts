import type { InferOutput } from 'valibot';
import {
  boolean,
  integer,
  number,
  object,
  optional,
  picklist,
  pipe,
  string,
} from 'valibot';

// User Stats Schema
export const UserStatsSchema = object({
  xp: pipe(number(), integer()),
  level: pipe(number(), integer()),
  streak: pipe(number(), integer()),
  hearts: pipe(number(), integer()),
  gems: pipe(number(), integer()),
  league: string(), // e.g., "obsidian", "pearl", "sapphire"
  leagueRank: pipe(number(), integer()),
});

export type UserStats = InferOutput<typeof UserStatsSchema>;

// Leaderboard Entry Schema
export const LeaderboardEntrySchema = object({
  rank: pipe(number(), integer()),
  userId: string(),
  name: string(),
  xp: pipe(number(), integer()),
  avatarUrl: optional(string()),
  isCurrentUser: boolean(),
});

export type LeaderboardEntry = InferOutput<typeof LeaderboardEntrySchema>;

// Quest Schema
export const QuestSchema = object({
  id: pipe(number(), integer()),
  titleKey: string(), // i18n key
  descriptionKey: string(), // i18n key
  target: pipe(number(), integer()),
  current: pipe(number(), integer()),
  xpReward: pipe(number(), integer()),
  completed: boolean(),
  iconType: picklist(['xp', 'accuracy', 'streak', 'lessons']),
});

export type Quest = InferOutput<typeof QuestSchema>;

// Navigation Item Schema
export const NavItemSchema = object({
  id: string(),
  labelKey: string(), // i18n key
  iconName: string(), // Lucide icon name
  href: string(),
  isActive: boolean(),
});

export type NavItem = InferOutput<typeof NavItemSchema>;

/**
 * User Status Schema (for sidebar)
 */
export const UserStatusSchema = object({
  emoji: string(),
  label: string(),
});

export type UserStatus = InferOutput<typeof UserStatusSchema>;
