'use client';

import { TrophyIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ItemGroup } from '@/components/ui/item';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry, UserStats } from '../_schemas/private';
import { LeaderboardRow } from './leaderboard-row';

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
  userStats: UserStats;
}

/**
 * Leaderboard preview widget showing top 3 and current user position.
 */
export function LeaderboardCard({ entries, userStats }: LeaderboardCardProps) {
  const t = useTranslations('global');

  // Get league display name
  const leagueDisplayName = t(userStats.leagueNameKey);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2">
        <div className="flex w-full items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <TrophyIcon className="size-5 text-amber-500" />
            {leagueDisplayName}
          </CardTitle>
          <CardAction>
            <Link
              href="/leaderboard"
              className={cn(
                buttonVariants({ variant: 'link' }),
                'px-0 uppercase',
              )}
            >
              {t('private_layout.leaderboard.view_league')}
            </Link>
          </CardAction>
        </div>
        <CardDescription>
          {t('private_layout.leaderboard.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-0">
          {entries.map((entry) => (
            <LeaderboardRow key={entry.userId} entry={entry} />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
