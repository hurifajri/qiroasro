import { ItemGroup } from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';

import { LeaderboardRow } from '../../_components/leaderboard-row';
import type { FullLeaderboardEntry } from '../_schemas/leaderboard';

interface LeaderboardListProps {
  entries: FullLeaderboardEntry[];
}

export function LeaderboardList({ entries }: Readonly<LeaderboardListProps>) {
  // Separate promotion zone (top 3), safe zone, and demotion zone (bottom 3)
  const promotionZone = entries.filter((e) => e.rank <= 3);
  const safeZone = entries.filter((e) => e.rank > 3 && e.rank <= 7);
  const demotionZone = entries.filter((e) => e.rank > 7);

  return (
    <div className="flex flex-col gap-0">
      {/* Promotion Zone (Top 3) */}
      <ItemGroup className="gap-0">
        {promotionZone.map((entry) => (
          <LeaderboardRow key={entry.userId} entry={entry} />
        ))}
      </ItemGroup>

      {promotionZone.length > 0 && safeZone.length > 0 && (
        <Separator className="my-4" />
      )}

      {/* Safe Zone */}
      <ItemGroup className="gap-0">
        {safeZone.map((entry) => (
          <LeaderboardRow key={entry.userId} entry={entry} />
        ))}
      </ItemGroup>

      {safeZone.length > 0 && demotionZone.length > 0 && (
        <Separator className="my-4" />
      )}

      {/* Demotion Zone */}
      <ItemGroup className="gap-0">
        {demotionZone.map((entry) => (
          <LeaderboardRow key={entry.userId} entry={entry} />
        ))}
      </ItemGroup>
    </div>
  );
}
