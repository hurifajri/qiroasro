import {
  getCurrentUserMonthlyBadges,
  getCurrentUserStats,
} from '@/features/gamification/services/gamification';

import { MonthlyBadgesCard } from '../../_components/monthly-badges-card';
import { StatList } from '../../_components/stat-list';

export default async function QuestsSidebar() {
  const [stats, badges] = await Promise.all([
    getCurrentUserStats(),
    getCurrentUserMonthlyBadges(),
  ]);

  return (
    <>
      <StatList stats={stats} />
      <MonthlyBadgesCard badges={badges} />
    </>
  );
}
