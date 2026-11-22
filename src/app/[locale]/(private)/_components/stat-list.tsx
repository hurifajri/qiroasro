import { FlameIcon, GemIcon, HeartIcon, ZapIcon } from 'lucide-react';

import type { UserStats } from '@/features/gamification/schemas/gamification';
import { cn } from '@/lib/utils';

import { StatItem } from './stat-item';

interface StatListProps {
  stats: UserStats;
  className?: string;
}

/**
 * Top stats bar showing XP, Streak, Hearts, and Gems.
 * Responsive: horizontal on desktop, compact on mobile.
 */
export function StatList({ stats, className }: Readonly<StatListProps>) {
  const { xp, streak, hearts, gems } = stats;

  return (
    <ul className={cn('flex items-center justify-evenly gap-2 p-2', className)}>
      {/* XP */}
      <StatItem
        icon={<ZapIcon className="size-5 fill-amber-400 text-amber-500" />}
        value={xp}
        color="text-amber-500"
      />

      {/* Streak */}
      <StatItem
        icon={<FlameIcon className="size-5 fill-orange-500 text-orange-600" />}
        value={streak}
        color="text-orange-500"
      />

      {/* Gems */}
      <StatItem
        icon={<GemIcon className="size-5 fill-sky-400 text-sky-500" />}
        value={gems}
        color="text-sky-500"
      />

      {/* Hearts */}
      <StatItem
        icon={<HeartIcon className="size-5 fill-rose-500 text-rose-600" />}
        value={hearts}
        color="text-rose-500"
      />
    </ul>
  );
}
