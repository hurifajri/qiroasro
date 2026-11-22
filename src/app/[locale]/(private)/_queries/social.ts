import { queryOptions } from '@tanstack/react-query';

import {
  getCurrentUserLeaderboardPreview,
  getFriendSuggestions,
  getUserActivityFeed,
  getUserFollowers,
  getUserFollowing,
  getWeeklyLeaderboard,
} from '../_services/social';

export const socialKeys = {
  all: ['social'] as const,
  leaderboard: (limit = 30) =>
    [...socialKeys.all, 'leaderboard', limit] as const,
  leaderboardPreview: () => [...socialKeys.all, 'leaderboard-preview'] as const,
  following: (userId: string, limit = 5) =>
    [...socialKeys.all, 'following', userId, limit] as const,
  followers: (userId: string, limit = 5) =>
    [...socialKeys.all, 'followers', userId, limit] as const,
  friendSuggestions: (profileUserId = '', limit = 6) =>
    [...socialKeys.all, 'friend-suggestions', profileUserId, limit] as const,
  activityFeed: (userId: string, limit = 5) =>
    [...socialKeys.all, 'activity-feed', userId, limit] as const,
};

export function getWeeklyLeaderboardOpt(limit = 30) {
  return queryOptions({
    queryKey: socialKeys.leaderboard(limit),
    queryFn: () => getWeeklyLeaderboard(limit),
    staleTime: 60 * 1000,
  });
}

export function getLeaderboardPreviewOpt() {
  return queryOptions({
    queryKey: socialKeys.leaderboardPreview(),
    queryFn: () => getCurrentUserLeaderboardPreview(),
    staleTime: 60 * 1000,
  });
}

export function getUserFollowingOpt(userId: string, limit = 5) {
  return queryOptions({
    queryKey: socialKeys.following(userId, limit),
    queryFn: () => getUserFollowing(userId, limit),
    staleTime: 60 * 1000,
    enabled: userId.length > 0,
  });
}

export function getUserFollowersOpt(userId: string, limit = 5) {
  return queryOptions({
    queryKey: socialKeys.followers(userId, limit),
    queryFn: () => getUserFollowers(userId, limit),
    staleTime: 60 * 1000,
    enabled: userId.length > 0,
  });
}

export function getFriendSuggestionsOpt(profileUserId?: string, limit = 6) {
  return queryOptions({
    queryKey: socialKeys.friendSuggestions(profileUserId, limit),
    queryFn: () => getFriendSuggestions(profileUserId, limit),
    staleTime: 60 * 1000,
  });
}

export function getUserActivityFeedOpt(userId: string, limit = 5) {
  return queryOptions({
    queryKey: socialKeys.activityFeed(userId, limit),
    queryFn: () => getUserActivityFeed(userId, limit),
    staleTime: 60 * 1000,
    enabled: userId.length > 0,
  });
}
