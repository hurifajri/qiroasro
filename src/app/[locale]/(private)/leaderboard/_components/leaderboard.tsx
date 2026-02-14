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
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-lg">{t('ranking')}</h2>
          <span className="text-muted-foreground text-sm">
            {t('participants', { count: entries.length })}
          </span>
        </div>
        <LeaderboardList entries={entries} />
      </section>
    </div>
  );
}
