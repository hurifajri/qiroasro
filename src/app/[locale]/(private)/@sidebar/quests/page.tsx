import { MonthlyBadgesCard } from '../../_components/monthly-badges-card';
import { StatList } from '../../_components/stat-list';
import { MOCK_MONTHLY_BADGES, MOCK_USER_STATS } from '../../_lib/mock-data';

export default function QuestsSidebar() {
  return (
    <>
      <StatList stats={MOCK_USER_STATS} />
      <MonthlyBadgesCard badges={MOCK_MONTHLY_BADGES} />
    </>
  );
}
