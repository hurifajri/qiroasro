'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import type { Achievement } from '@/features/gamification/schemas/achievement';
import type { Statistic } from '@/features/gamification/schemas/gamification';
import { getUserProfileByUsernameOpt } from '@/features/user-profile/queries/user-profile';
import type { FriendSuggestion } from '@/features/user-profile/schemas/user-profile';

import { AchievementList } from './achievement-list';
import { FriendSuggestionsGrid } from './friend-suggestions-grid';
import { StatGrid } from './stat-grid';
import { UserInfo } from './user-info';

interface ProfileProps {
  username: string;
  stats: Statistic[];
  friendSuggestions: FriendSuggestion[];
  achievements: Achievement[];
}

export function Profile({
  username,
  stats,
  friendSuggestions,
  achievements,
}: Readonly<ProfileProps>) {
  const t = useTranslations('profile_page');

  const { data: userProfile } = useSuspenseQuery(
    getUserProfileByUsernameOpt(username),
  );

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {/* User Info */}
      {userProfile && <UserInfo user={userProfile} />}

      {/* Statistics */}
      <div className="@container flex flex-col gap-3">
        <h2 className="text-lg font-bold">{t('statistics.title')}</h2>
        <StatGrid stats={stats} />
      </div>

      {/* Friend Suggestions */}
      <div className="@container flex flex-col gap-3">
        <div className="flex w-full items-center justify-between gap-2">
          <h2 className="text-lg font-bold">{t('friend_suggestions.title')}</h2>
          <Button variant="link" className="px-0">
            {t('friend_suggestions.view_all')}
          </Button>
        </div>
        <FriendSuggestionsGrid friends={friendSuggestions} />
      </div>

      {/* Achievements */}
      <div className="flex flex-col gap-3">
        <div className="flex w-full items-center justify-between gap-2">
          <h2 className="text-lg font-bold">{t('achievements.title')}</h2>
          <Button variant="link" className="px-0">
            {t('achievements.view_all')}
          </Button>
        </div>
        <AchievementList achievements={achievements} />
      </div>
    </div>
  );
}
