import type { Statistic } from '../../../_schemas/user-profile';
import { StatItem } from './stat-item';

interface StatGridProps {
  stats: Statistic[];
}

export function StatGrid({ stats }: StatGridProps) {
  return (
    <ul className="grid @md:grid-cols-2 grid-cols-1 gap-3">
      {stats.map((stat) => (
        <StatItem key={stat.id} stat={stat} />
      ))}
    </ul>
  );
}
