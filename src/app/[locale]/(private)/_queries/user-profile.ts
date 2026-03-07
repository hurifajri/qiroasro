import { queryOptions } from '@tanstack/react-query';
import {
  getUserProfileById,
  getUserProfileByUsername,
} from '../_services/user-profile';

const userProfileKeys = {
  all: ['user-profile'] as const,
  byUserId: (userId: string) =>
    [...userProfileKeys.all, 'user', userId] as const,
  byUsername: (username: string) =>
    [...userProfileKeys.all, 'username', username] as const,
};

export function getUserProfileByUserIdOpt(userId: string) {
  return queryOptions({
    queryKey: userProfileKeys.byUserId(userId),
    queryFn: () => getUserProfileById(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function getUserProfileByUsernameOpt(username: string) {
  return queryOptions({
    queryKey: userProfileKeys.byUsername(username),
    queryFn: () => getUserProfileByUsername(username),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
