import { MonthlyBadgesCard } from '../../_components/monthly-badges-card';
import { StatList } from '../../_components/stat-list';
import {
  getCurrentUserMonthlyBadges,
  getCurrentUserStats,
} from '../../_services/gamification';

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
