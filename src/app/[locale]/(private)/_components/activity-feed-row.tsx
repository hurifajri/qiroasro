import { formatDistanceToNow } from 'date-fns';
import { PartyPopperIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import type { Locale } from '@/i18n/routing';
import { getDateLocale } from '@/lib/date';

import { UserAvatar } from '../_components/user-avatar';
import type { ActivityFeedItem } from '../_schemas/private';

interface ActivityFeedRowProps {
  item: ActivityFeedItem;
}

export function ActivityFeedRow({ item }: Readonly<ActivityFeedRowProps>) {
  const t = useTranslations('global.private_layout');
  const locale = useLocale() as Locale;

  const timeAgo = formatDistanceToNow(new Date(item.activityDate), {
    addSuffix: true,
    locale: getDateLocale(locale),
  });

  return (
    <Item asChild>
      <li className="p-0!">
        {/* Avatar */}
        <ItemMedia>
          <UserAvatar
            name={item.userName}
            colorCode={item.avatarColorCode}
            size="lg"
          />
        </ItemMedia>

        {/* User info and description */}
        <ItemContent>
          <ItemTitle>{item.userName}</ItemTitle>
          <ItemDescription>{timeAgo}</ItemDescription>
        </ItemContent>
        <ItemContent className="w-full">
          <ItemDescription>{t(item.descriptionKey)}</ItemDescription>
        </ItemContent>

        {/* Footer with celebrate button and reactions */}
        <ItemFooter className="justify-start">
          <Button variant="outline">
            <PartyPopperIcon />
            {t('activity_feed.celebrate')}
          </Button>
          <div className="flex items-center gap-1">
            {item.reactionEmojis.map((emoji) => (
              <span key={emoji}>{emoji}</span>
            ))}
            <span className="text-xs text-muted-foreground">
              {item.reactionCount}
            </span>
          </div>
        </ItemFooter>
      </li>
    </Item>
  );
}
