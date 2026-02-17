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
    <div className="flex flex-col gap-6">
      {/* League Header */}
      <LeagueHeader
        leagues={leagues}
        currentLeagueNameKey={currentLeagueNameKey}
      />

      {/* Leaderboard */}
      <section className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-2">
          <h2 className="font-bold text-xl">{t('ranking')}</h2>
          <span className="text-muted-foreground">
            {t('participants', { count: entries.length })}
          </span>
        </div>
        <LeaderboardList entries={entries} />
      </section>
    </div>
  );
}
