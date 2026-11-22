import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import type { MonthlyBadge } from '@/features/gamification/schemas/badge';
import { getEmojiColorClass } from '@/lib/colors';
import { cn } from '@/lib/utils';

interface MonthlyBadgeRowProps {
  badge: MonthlyBadge;
}

export function MonthlyBadgesRow({ badge }: Readonly<MonthlyBadgeRowProps>) {
  const t = useTranslations('global');

  return (
    <Item asChild>
      <li className="p-0!">
        <ItemMedia>
          <Avatar
            size="lg"
            className={cn(getEmojiColorClass(badge.emojiColorCode))}
          >
            <AvatarFallback className="bg-transparent text-2xl">
              {badge.emoji}
            </AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{t(badge.titleKey)}</ItemTitle>
          <ItemDescription className="text-xs">
            {t(badge.descriptionKey)}
          </ItemDescription>
        </ItemContent>
      </li>
    </Item>
  );
}
