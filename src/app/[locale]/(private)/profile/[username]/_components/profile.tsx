'use client';

import { useTranslations } from 'next-intl';
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

      {/* Statistics */}
      <section>
        <h2 className="mb-4 font-bold text-xl">{t('statistics')}</h2>
        <StatGrid stats={stats} />
      </section>

      <Separator />

      {/* Friend Suggestions */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-xl">{t('friend_suggestions')}</h2>
          <button
            type="button"
            className="font-semibold text-primary text-sm hover:underline"
          >
            {t('view_all')}
          </button>
        </div>
        <FriendSuggestionsGrid friends={friendSuggestions} />
      </section>

      <Separator />

      {/* Achievements */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-xl">{t('achievements')}</h2>
          <button
            type="button"
            className="font-semibold text-primary text-sm hover:underline"
          >
            {t('view_all')}
          </button>
        </div>
        <AchievementList achievements={achievements} />
      </section>
    </div>
  );
}
