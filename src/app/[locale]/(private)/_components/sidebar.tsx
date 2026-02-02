import { useTranslations } from 'next-intl';
import {
  MOCK_LEADERBOARD,
  MOCK_QUESTS,
  MOCK_USER_STATS,
} from '../_lib/mock-data';
import type { NavItem } from '../_schemas/private';
import { LeaderboardCard } from './leaderboard-card';
import { LevelCard } from './level-card';
import { SidebarNav } from './navigation';
import { QuestsCard } from './quests-card';
import { StatList } from './stat-list';

interface LeftSidebarProps {
  navItems: NavItem[];
}

export function LeftSidebar({ navItems }: LeftSidebarProps) {
  return (
    <aside className="hidden w-18.25 shrink-0 border-r bg-card p-3 sm:block lg:w-56">
      <div className="sticky top-4">
        <SidebarNav items={navItems} />
      </div>
    </aside>
  );
}

export function RightSidebar() {
  const t = useTranslations('global.private_layout');

  return (
    <aside className="hidden w-80 shrink-0 border-l bg-card p-4 md:block">
      <div className="sticky top-4 flex flex-col gap-4">
        <h2 className="sr-only">{t('right_sidebar_title')}</h2>
        <StatList stats={MOCK_USER_STATS} />
        <LevelCard />
        <LeaderboardCard
          entries={MOCK_LEADERBOARD}
          userStats={MOCK_USER_STATS}
        />
        <QuestsCard quests={MOCK_QUESTS} />
      </div>
    </aside>
  );
}
