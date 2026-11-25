import { ItemGroup } from '@/components/ui/item';
import type { Quest } from '@/features/gamification/schemas/gamification';

import { QuestRow } from '../../_components/quests-row';

interface DailyQuestListProps {
  quests: Quest[];
}

export function DailyQuestList({ quests }: Readonly<DailyQuestListProps>) {
  return (
    <ItemGroup>
      {quests.map((quest) => (
        <QuestRow key={quest.id} quest={quest} />
      ))}
    </ItemGroup>
  );
}
