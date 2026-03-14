'use client';

import { useTranslations } from 'next-intl';
import type { Statistic } from '../../../_schemas/user-profile';
import { StatCard } from './stat-card';

interface StatItemProps {
  stat: Statistic;
}

export function StatItem({ stat }: StatItemProps) {
  const t = useTranslations('profile_page.statistics');

  return (
    <li>
      <StatCard label={t(stat.labelKey)} value={stat.value} icon={stat.icon} />
    </li>
  );
}
