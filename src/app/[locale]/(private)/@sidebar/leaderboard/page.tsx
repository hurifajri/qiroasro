import { StatList } from '../../_components/stat-list';
import { StatusCard } from '../../_components/status-card';
import { MOCK_USER_STATS, MOCK_USER_STATUSES } from '../../_lib/mock-data';

export default function LeaderboardSidebar() {
  return (
    <>
      <StatList stats={MOCK_USER_STATS} />
      <StatusCard statuses={MOCK_USER_STATUSES} />
    </>
  );
}
