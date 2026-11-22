'use client';

import { useTranslations } from 'next-intl';

import type { League } from '../../_schemas/league';
import type { LeaderboardEntry, LeagueNameKey } from '../../_schemas/private';
import { LeaderboardList } from './leaderboard-list';
import { LeagueHeader } from './league-header';

interface LeaderboardProps {
  leagues: League[];
  currentLeagueNameKey: LeagueNameKey;
  entries: LeaderboardEntry[];
}

export function Leaderboard({
  leagues,
  currentLeagueNameKey,
  entries,
}: Readonly<LeaderboardProps>) {
  const t = useTranslations('leaderboard_page');

  return (
    <div className="mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-6">
      {/* League Header */}
      <LeagueHeader leagues={leagues} nameKey={currentLeagueNameKey} />

      {/* Leaderboard */}
      <div className="flex flex-col gap-3">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-bold">{t('ranking')}</h2>
          <p className="text-muted-foreground">
            {t('participants', { count: entries.length })}
          </p>
        </div>
        <LeaderboardList entries={entries} />
      </div>
    </div>
  );
}
