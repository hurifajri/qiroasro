import { queryOptions } from '@tanstack/react-query';

import {
  getUserProfileById,
  getUserProfileByUsername,
} from '../_services/user-profile';

const userProfileKeys = {
  all: ['user-profile'],
  byUserId: (userId: string) => [...userProfileKeys.all, 'user', userId],
  byUsername: (username: string) => [
    ...userProfileKeys.all,
    'username',
    username,
  ],
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
