import { ItemGroup } from '@/components/ui/item';
import { QuestRow } from '../../_components/quests-row';
import type { Quest } from '../../_schemas/private';

interface DailyQuestListProps {
  quests: Quest[];
}

export function DailyQuestList({ quests }: DailyQuestListProps) {
  return (
    <ItemGroup>
      {quests.map((quest) => (
        <QuestRow key={quest.id} quest={quest} />
      ))}
    </ItemGroup>
  );
}
