import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ItemGroup } from '@/components/ui/item';
import type { Quest } from '../_schemas/private';
import { QuestRow } from './quests-row';

interface QuestsCardProps {
  quests: Quest[];
}

/**
 * Daily quests widget showing progress towards daily challenges.
 */
export function QuestsCard({ quests }: QuestsCardProps) {
  const t = useTranslations('global.private_layout');

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <CardTitle>
          <h3 className="font-bold">{t('daily_quests.title')}</h3>
        </CardTitle>
        <CardAction>
          <Button variant="link" className="px-0">
            {t('daily_quests.view_all')}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-3">
          {quests.map((quest) => (
            <QuestRow key={quest.id} quest={quest} />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
