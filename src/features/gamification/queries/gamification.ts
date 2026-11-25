import { queryOptions } from '@tanstack/react-query';

import {
  getCurrentUserDailyQuests,
  getCurrentUserMonthlyBadges,
  getCurrentUserMonthlyQuest,
  getCurrentUserStats,
  getUserAchievementsById,
  getUserStatsById,
  getUserXpHistory,
} from '../services/gamification';

export const gamificationKeys = {
  all: ['gamification'] as const,
  currentStats: () => [...gamificationKeys.all, 'stats', 'current'] as const,
  userStats: (userId: string) =>
    [...gamificationKeys.all, 'stats', userId] as const,
  currentDailyQuests: () =>
    [...gamificationKeys.all, 'daily-quests', 'current'] as const,
  currentMonthlyQuest: () =>
    [...gamificationKeys.all, 'monthly-quest', 'current'] as const,
  currentMonthlyBadges: () =>
    [...gamificationKeys.all, 'monthly-badges', 'current'] as const,
  userAchievements: (userId: string) =>
    [...gamificationKeys.all, 'achievements', userId] as const,
  userXpHistory: (userId: string) =>
    [...gamificationKeys.all, 'xp-history', userId] as const,
};

export function getCurrentUserStatsOpt() {
  return queryOptions({
    queryKey: gamificationKeys.currentStats(),
    queryFn: () => getCurrentUserStats(),
    staleTime: 60 * 1000,
  });
}

export function getUserStatsByIdOpt(userId: string) {
  return queryOptions({
    queryKey: gamificationKeys.userStats(userId),
    queryFn: () => getUserStatsById(userId),
    staleTime: 60 * 1000,
    enabled: userId.length > 0,
  });
}

export function getCurrentUserDailyQuestsOpt() {
  return queryOptions({
    queryKey: gamificationKeys.currentDailyQuests(),
    queryFn: () => getCurrentUserDailyQuests(),
    staleTime: 60 * 1000,
  });
}

export function getCurrentUserMonthlyQuestOpt() {
  return queryOptions({
    queryKey: gamificationKeys.currentMonthlyQuest(),
    queryFn: () => getCurrentUserMonthlyQuest(),
    staleTime: 60 * 1000,
  });
}

export function getCurrentUserMonthlyBadgesOpt() {
  return queryOptions({
    queryKey: gamificationKeys.currentMonthlyBadges(),
    queryFn: () => getCurrentUserMonthlyBadges(),
    staleTime: 60 * 1000,
  });
}

export function getUserAchievementsByIdOpt(userId: string) {
  return queryOptions({
    queryKey: gamificationKeys.userAchievements(userId),
    queryFn: () => getUserAchievementsById(userId),
    staleTime: 60 * 1000,
    enabled: userId.length > 0,
  });
}

export function getUserXpHistoryOpt(userId: string) {
  return queryOptions({
    queryKey: gamificationKeys.userXpHistory(userId),
    queryFn: () => getUserXpHistory(userId),
    staleTime: 60 * 1000,
    enabled: userId.length > 0,
  });
}
