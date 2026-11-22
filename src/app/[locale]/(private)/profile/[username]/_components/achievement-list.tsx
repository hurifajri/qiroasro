import { ItemGroup } from '@/components/ui/item';
import type { Achievement } from '@/features/gamification/schemas/achievement';

import { AchievementItem } from './achievement-item';

interface AchievementListProps {
  achievements: Achievement[];
}

export function AchievementList({
  achievements,
}: Readonly<AchievementListProps>) {
  return (
    <ItemGroup>
      {achievements.map((achievement) => (
        <AchievementItem key={achievement.id} achievement={achievement} />
      ))}
    </ItemGroup>
  );
}
