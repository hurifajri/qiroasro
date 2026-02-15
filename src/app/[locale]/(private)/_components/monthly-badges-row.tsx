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
import type { MonthlyBadge } from '../_schemas/private';

interface MonthlyBadgeRowProps {
  badge: MonthlyBadge;
}

export function MonthlyBadgesRow({ badge }: MonthlyBadgeRowProps) {
  const t = useTranslations('global.private_layout');

  return (
    <Item asChild>
      <li className="p-0!">
        <ItemMedia variant="icon">
          <Avatar className={cn('size-12', badge.iconBg)}>
            <AvatarFallback className="bg-transparent text-2xl">
              {badge.iconEmoji}
            </AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{t(badge.titleKey)}</ItemTitle>
          <ItemDescription>{t(badge.dateKey)}</ItemDescription>
        </ItemContent>
      </li>
    </Item>
  );
}
