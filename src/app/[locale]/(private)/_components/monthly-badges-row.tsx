import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { cn } from '@/lib/utils';
import { getEmojiBadgeColorClass } from '../_lib/colors';
import type { MonthlyBadge } from '../_schemas/badge';

interface MonthlyBadgeRowProps {
  badge: MonthlyBadge;
}

export function MonthlyBadgesRow({ badge }: MonthlyBadgeRowProps) {
  const t = useTranslations('global');

  return (
    <Item asChild>
      <li className="p-0!">
        <ItemMedia>
          <Avatar
            size="lg"
            className={cn(getEmojiBadgeColorClass(badge.emojiColorCode))}
          >
            <AvatarFallback className="bg-transparent text-2xl">
              {badge.emoji}
            </AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{t(badge.titleKey)}</ItemTitle>
          <ItemDescription className="text-xs">
            {t(badge.dateKey)}
          </ItemDescription>
        </ItemContent>
      </li>
    </Item>
  );
}
