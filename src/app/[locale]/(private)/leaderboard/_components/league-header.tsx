import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { League } from '../_schemas/leaderboard';

interface LeagueHeaderProps {
  leagues: League[];
  currentLeague: string;
}

export function LeagueHeader({ leagues, currentLeague }: LeagueHeaderProps) {
  const t = useTranslations();

  const currentLeagueData = leagues.find((l) => l.id === currentLeague);
  const leagueName = currentLeagueData
    ? t(`global.${currentLeagueData.nameKey}`)
    : currentLeague;

  return (
    <section className="flex flex-col items-center gap-4">
      {/* League icons row */}
      <div className="flex items-center justify-center gap-3">
        {leagues.map((league) => {
          const isActive = league.id === currentLeague;
          const currentIndex = leagues.findIndex((l) => l.id === currentLeague);
          const leagueIndex = leagues.indexOf(league);
          const isPast = leagueIndex < currentIndex;

          return (
            <div
              key={league.id}
              className={cn(
                'flex size-12 items-center justify-center rounded-xl text-2xl transition-all',
                isActive &&
                  'scale-125 ring-2 ring-primary ring-offset-2 ring-offset-background',
                isPast && 'opacity-100',
                !isActive && !isPast && 'opacity-40 grayscale',
              )}
            >
              {league.emoji}
            </div>
          );
        })}
      </div>

      {/* League name */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-bold text-2xl">{leagueName}</h2>
        <Badge variant="secondary" className="font-medium">
          {t('leaderboard_page.week_info')}
        </Badge>
      </div>
    </section>
  );
}
