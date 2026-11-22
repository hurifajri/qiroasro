import { LeaderboardCard } from '../_components/leaderboard-card';
import { LevelCard } from '../_components/level-card';
import { QuestsCard } from '../_components/quests-card';
import { StatList } from '../_components/stat-list';
import { MOCK_LEADERBOARD } from '../_lib/mock-data';
import {
  getCurrentUserDailyQuests,
  getCurrentUserStats,
} from '../_services/gamification';

export default async function DefaultSidebar() {
  const [stats, quests] = await Promise.all([
    getCurrentUserStats(),
    getCurrentUserDailyQuests(),
  ]);

  return (
    <>
      <StatList stats={stats} />
      <LevelCard />
      <LeaderboardCard entries={MOCK_LEADERBOARD} userStats={stats} />
      <QuestsCard quests={quests} />
    </>
  );
}
