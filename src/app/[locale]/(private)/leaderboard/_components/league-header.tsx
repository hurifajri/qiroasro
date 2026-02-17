import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { League } from '../../_schemas/league';
import type { LeagueNameKey } from '../../_schemas/private';

interface LeagueHeaderProps {
  leagues: League[];
  currentLeagueNameKey: LeagueNameKey;
}

export function LeagueHeader({
  leagues,
  currentLeagueNameKey,
}: LeagueHeaderProps) {
  const t = useTranslations();

  const currentLeagueData = leagues.find(
    (l) => l.nameKey === currentLeagueNameKey,
  );
  const leagueName = currentLeagueData
    ? t(`global.${currentLeagueData.nameKey}`)
    : '';

  return (
    <section className="flex flex-col items-center gap-4">
      {/* League icons row */}
      <div
        className="relative flex h-20 w-fit max-w-full items-center justify-center overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
        }}
      >
        <div
          className="flex items-center gap-3 transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(calc(50% - ${leagues.findIndex((l) => l.nameKey === currentLeagueNameKey) * 60 + 24}px))`,
          }}
        >
          {leagues.map((league, index) => {
            const isActive = league.nameKey === currentLeagueNameKey;
            const currentIndex = leagues.findIndex(
              (l) => l.nameKey === currentLeagueNameKey,
            );
            const distance = Math.abs(index - currentIndex);
            const isDisguised = distance >= 2;

            return (
              <div
                key={league.id}
                className={cn(
                  'flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl transition-all duration-300',
                  isActive &&
                    'scale-125 ring-2 ring-primary ring-offset-2 ring-offset-background',
                  isDisguised ? 'opacity-20 grayscale' : 'opacity-100',
                )}
              >
                {league.emoji}
              </div>
            );
          })}
        </div>
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
