'use client';

import { useTranslations } from 'next-intl';

import type { Statistic } from '@/features/gamification/schemas/gamification';

import { StatCard } from './stat-card';

interface StatItemProps {
  stat: Statistic;
}

export function StatItem({ stat }: Readonly<StatItemProps>) {
  const t = useTranslations('profile_page.statistics');

  return (
    <li>
      <StatCard label={t(stat.labelKey)} value={stat.value} icon={stat.icon} />
    </li>
  );
}
