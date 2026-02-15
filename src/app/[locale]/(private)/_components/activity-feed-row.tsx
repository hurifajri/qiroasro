import { PartyPopperIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import type { ActivityFeedItem } from '../_schemas/private';

interface ActivityFeedRowProps {
  item: ActivityFeedItem;
}

export function ActivityFeedRow({ item }: ActivityFeedRowProps) {
  const t = useTranslations('global.private_layout.profile_sidebar');

  return (
    <Item asChild>
      <li className="p-0!">
        {/* Avatar */}
        <ItemMedia variant="image">
          <Avatar size="lg">
            <AvatarImage src={item.avatarUrl} alt={item.userName} />
            <AvatarFallback>
              {item.userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </ItemMedia>

        {/* User info and description */}
        <ItemContent>
          <ItemTitle>{item.userName}</ItemTitle>
          <ItemDescription>{item.timeAgo}</ItemDescription>
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
            <span className="text-muted-foreground text-xs">
              {item.reactionCount}
            </span>
          </div>
        </ItemFooter>
      </li>
    </Item>
  );
}
