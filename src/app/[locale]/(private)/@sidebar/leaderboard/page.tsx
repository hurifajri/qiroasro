import { StatList } from '../../_components/stat-list';
import { MOCK_USER_STATS } from '../../_lib/mock-data';
import { StatusCard } from '../../leaderboard/_components/status-card';
import { MOCK_USER_STATUSES } from '../../leaderboard/_lib/mock-data';

export default function LeaderboardSidebar() {
  return (
    <>
      <StatList stats={MOCK_USER_STATS} />
      <StatusCard statuses={MOCK_USER_STATUSES} />
    </>
  );
}
