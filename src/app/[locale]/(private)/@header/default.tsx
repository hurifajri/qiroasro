import { getCurrentUserStats } from '@/features/gamification/services/gamification';

import { StatList } from '../_components/stat-list';

export default async function DefaultHeader() {
  const stats = await getCurrentUserStats();

  return (
    <StatList
      stats={stats}
      className="rounded-xl border bg-background/10 backdrop-blur-sm"
    />
  );
}
