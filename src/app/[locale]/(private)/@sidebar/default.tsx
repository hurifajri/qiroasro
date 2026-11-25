import {
  getCurrentUserDailyQuests,
  getCurrentUserStats,
} from '@/features/gamification/services/gamification';

import { LeaderboardCard } from '../_components/leaderboard-card';
import { LevelCard } from '../_components/level-card';
import { QuestsCard } from '../_components/quests-card';
import { StatList } from '../_components/stat-list';
import { getCurrentUserLeaderboardPreview } from '../_services/social';

export default async function DefaultSidebar() {
  const [stats, quests, leaderboardEntries] = await Promise.all([
    getCurrentUserStats(),
    getCurrentUserDailyQuests(),
    getCurrentUserLeaderboardPreview(),
  ]);

  return (
    <>
      <StatList stats={stats} />
      <LevelCard />
      <LeaderboardCard entries={leaderboardEntries} userStats={stats} />
      <QuestsCard quests={quests} />
    </>
  );
}
