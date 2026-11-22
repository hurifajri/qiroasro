import { useTranslations } from 'next-intl';
import { Fragment } from 'react';

import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ItemGroup } from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

import type { ActivityFeedItem } from '../_schemas/private';
import { ActivityFeedRow } from './activity-feed-row';

interface ActivityFeedCardProps {
  items: ActivityFeedItem[];
}

export function ActivityFeedCard({ items }: Readonly<ActivityFeedCardProps>) {
  const t = useTranslations('global.private_layout');

  return (
    <Card>
      <CardHeader className="flex w-full items-center justify-between gap-2">
        <CardTitle>{t('activity_feed.title')}</CardTitle>
        <CardAction>
          <Link
            href="/friend-updates"
            className={cn(buttonVariants({ variant: 'link' }), 'px-0')}
          >
            {t('activity_feed.view_all')}
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {items.map((item, index) => (
            <Fragment key={item.id}>
              <ActivityFeedRow item={item} />
              {index < items.length - 1 && <Separator />}
            </Fragment>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
