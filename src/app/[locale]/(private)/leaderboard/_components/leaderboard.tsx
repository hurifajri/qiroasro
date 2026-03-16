'use client';

import { useTranslations } from 'next-intl';
import type { League } from '../../_schemas/league';
import type { LeagueNameKey } from '../../_schemas/private';
import type { FullLeaderboardEntry } from '../_schemas/leaderboard';
import { LeaderboardList } from './leaderboard-list';
import { LeagueHeader } from './league-header';

interface LeaderboardProps {
  leagues: League[];
  currentLeagueNameKey: LeagueNameKey;
  entries: FullLeaderboardEntry[];
}

export function Leaderboard({
  leagues,
  currentLeagueNameKey,
  entries,
}: LeaderboardProps) {
  const t = useTranslations('leaderboard_page');

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-6">
      {/* League Header */}
      <LeagueHeader leagues={leagues} nameKey={currentLeagueNameKey} />

      {/* Leaderboard */}
      <div className="flex flex-col gap-3">
        <div className="flex w-full items-center justify-between">
          <h2 className="font-bold text-lg">{t('ranking')}</h2>
          <p className="text-muted-foreground">
            {t('participants', { count: entries.length })}
          </p>
        </div>
        <LeaderboardList entries={entries} />
      </div>
    </div>
  );
}
