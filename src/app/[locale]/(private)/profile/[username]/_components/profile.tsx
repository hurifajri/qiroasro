'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { getUserProfileByUsernameOpt } from '../../../_queries/user-profile';
import type { Achievement } from '../../../_schemas/achievement';
import type {
  FriendSuggestion,
  Statistic,
} from '../../../_schemas/user-profile';
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
}: ProfileProps) {
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
        <h2 className="font-bold text-lg">{t('statistics.title')}</h2>
        <StatGrid stats={stats} />
      </div>

      {/* Friend Suggestions */}
      <div className="flex flex-col gap-3">
        <div className="flex w-full items-center justify-between gap-2">
          <h2 className="font-bold text-lg">{t('friend_suggestions.title')}</h2>
          <Button variant="link" className="px-0">
            {t('friend_suggestions.view_all')}
          </Button>
        </div>
        <FriendSuggestionsGrid friends={friendSuggestions} />
      </div>

      {/* Achievements */}
      <div className="flex flex-col gap-3">
        <div className="flex w-full items-center justify-between gap-2">
          <h2 className="font-bold text-lg">{t('achievements.title')}</h2>
          <Button variant="link" className="px-0">
            {t('achievements.view_all')}
          </Button>
        </div>
        <AchievementList achievements={achievements} />
      </div>
    </div>
  );
}
