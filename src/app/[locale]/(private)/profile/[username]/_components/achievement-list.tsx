import { ItemGroup } from '@/components/ui/item';
import type { Achievement } from '../_schemas/profile';
import { AchievementItem } from './achievement-item';

interface AchievementListProps {
  achievements: Achievement[];
}

export function AchievementList({ achievements }: AchievementListProps) {
  return (
    <ItemGroup className="gap-3">
      {achievements.map((achievement) => (
        <AchievementItem key={achievement.id} achievement={achievement} />
      ))}
    </ItemGroup>
  );
}
