import type { Statistic } from '../_schemas/profile';
import { StatCard } from './stat-card';

interface StatItemProps {
  stat: Statistic;
}

export function StatItem({ stat }: StatItemProps) {
  return (
    <li>
      <StatCard label={stat.label} value={stat.value} icon={stat.icon} />
    </li>
  );
}
