import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ItemGroup } from '@/components/ui/item';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

import type { Quest } from '../_schemas/private';
import { QuestRow } from './quests-row';

interface QuestsCardProps {
  quests: Quest[];
}

/**
 * Daily quests widget showing progress towards daily challenges.
 */
export function QuestsCard({ quests }: Readonly<QuestsCardProps>) {
  const t = useTranslations('global.private_layout');

  return (
    <Card>
      <CardHeader className="flex w-full items-center justify-between gap-2">
        <CardTitle>{t('daily_quests.title')}</CardTitle>
        <CardAction>
          <Link
            href="/quests"
            className={cn(buttonVariants({ variant: 'link' }), 'px-0')}
          >
            {t('daily_quests.view_all')}
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {quests.map((quest) => (
            <QuestRow key={quest.id} quest={quest} />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
