'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type {
  Achievement,
  FriendSuggestion,
  Statistic,
  UserProfile,
} from '../_schemas/profile';
import { AchievementList } from './achievement-list';
import { FriendSuggestionsGrid } from './friend-suggestions-grid';
import { StatGrid } from './stat-grid';
import { UserInfo } from './user-info';

interface ProfileProps {
  user: UserProfile;
  stats: Statistic[];
  friendSuggestions: FriendSuggestion[];
  achievements: Achievement[];
}

export function Profile({
  user,
  stats,
  friendSuggestions,
  achievements,
}: ProfileProps) {
  const t = useTranslations('profile_page');

  return (
    <div className="flex flex-col gap-6">
      {/* User Info */}
      <UserInfo user={user} />

      <Separator />

      {/* Statistics */}
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">{t('statistics.title')}</h2>
        <StatGrid stats={stats} />
      </section>

      <Separator />

      {/* Friend Suggestions */}
      <section className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-2">
          <h2 className="font-bold text-xl">{t('friend_suggestions.title')}</h2>
          <Button variant="link" className="px-0 uppercase">
            {t('friend_suggestions.view_all')}
          </Button>
        </div>
        <FriendSuggestionsGrid friends={friendSuggestions} />
      </section>

      <Separator />

      {/* Achievements */}
      <section className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-2">
          <h2 className="font-bold text-xl">{t('achievements.title')}</h2>
          <Button variant="link" className="px-0 uppercase">
            {t('achievements.view_all')}
          </Button>
        </div>
        <AchievementList achievements={achievements} />
      </section>
    </div>
  );
}
