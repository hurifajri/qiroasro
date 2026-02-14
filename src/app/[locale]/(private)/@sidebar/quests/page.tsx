import { StatList } from '../../_components/stat-list';
import { MOCK_USER_STATS } from '../../_lib/mock-data';
import { MonthlyBadgesCard } from '../../quests/_components/monthly-badges-card';
import { MOCK_MONTHLY_BADGES } from '../../quests/_lib/mock-data';

export default function QuestsSidebar() {
  return (
    <>
      <StatList stats={MOCK_USER_STATS} />
      <MonthlyBadgesCard badges={MOCK_MONTHLY_BADGES} />
    </>
  );
}
