import { StatList } from '../../_components/stat-list';
import { StatusCard } from '../../_components/status-card';
import { MOCK_USER_STATUSES } from '../../_lib/mock-data';
import { getCurrentUserStats } from '../../_services/gamification';

export default async function LeaderboardSidebar() {
  const stats = await getCurrentUserStats();

  return (
    <>
      <StatList stats={stats} />
      <StatusCard statuses={MOCK_USER_STATUSES} />
    </>
  );
}
