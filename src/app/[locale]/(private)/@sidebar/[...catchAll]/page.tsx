import { LeaderboardCard } from '../../_components/leaderboard-card';
import { LevelCard } from '../../_components/level-card';
import { QuestsCard } from '../../_components/quests-card';
import { StatList } from '../../_components/stat-list';
import {
  MOCK_LEADERBOARD,
  MOCK_QUESTS,
  MOCK_USER_STATS,
} from '../../_lib/mock-data';

export default function CatchAllSidebar() {
  return (
    <>
      <StatList stats={MOCK_USER_STATS} />
      <LevelCard />
      <LeaderboardCard entries={MOCK_LEADERBOARD} userStats={MOCK_USER_STATS} />
      <QuestsCard quests={MOCK_QUESTS} />
    </>
  );
}
