import { MonthlyBadgesCard } from '../../_components/monthly-badges-card';
import { StatList } from '../../_components/stat-list';
import { MONTHLY_BADGES } from '../../_lib/badge';
import { MOCK_USER_STATS } from '../../_lib/mock-data';

export default function QuestsSidebar() {
  return (
    <>
      <StatList stats={MOCK_USER_STATS} />
      <MonthlyBadgesCard badges={MONTHLY_BADGES} />
    </>
  );
}
