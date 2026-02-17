import type { Statistic } from '../_schemas/profile';
import { StatItem } from './stat-item';

interface StatGridProps {
  stats: Statistic[];
}

export function StatGrid({ stats }: StatGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {stats.map((stat) => (
        <StatItem key={stat.id} stat={stat} />
      ))}
    </ul>
  );
}
