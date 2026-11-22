import type { Statistic } from '../../../_schemas/user-profile';
import { StatItem } from './stat-item';

interface StatGridProps {
  stats: Statistic[];
}

export function StatGrid({ stats }: Readonly<StatGridProps>) {
  return (
    <ul className="grid grid-cols-1 gap-3 @md:grid-cols-2">
      {stats.map((stat) => (
        <StatItem key={stat.id} stat={stat} />
      ))}
    </ul>
  );
}
