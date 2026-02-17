'use client';

import { useTranslations } from 'next-intl';
import type { FullLeaderboardEntry, League } from '../_schemas/leaderboard';
import { LeaderboardList } from './leaderboard-list';
import { LeagueHeader } from './league-header';

interface LeaderboardProps {
  leagues: League[];
  currentLeague: string;
  entries: FullLeaderboardEntry[];
}

export function Leaderboard({
  leagues,
  currentLeague,
  entries,
}: LeaderboardProps) {
  const t = useTranslations('leaderboard_page');

  return (
    <div className="flex flex-col gap-6">
      {/* League Header */}
      <LeagueHeader leagues={leagues} currentLeague={currentLeague} />

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
