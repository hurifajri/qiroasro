import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { cn } from '@/lib/utils';
import type { MonthlyBadge } from '../_schemas/quests';

interface MonthlyBadgesCardProps {
  badges: MonthlyBadge[];
}

export function MonthlyBadgesCard({ badges }: MonthlyBadgesCardProps) {
  const t = useTranslations('quests_page');

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <CardTitle>
          <h3 className="font-bold">{t('monthly_badges')}</h3>
        </CardTitle>
        <CardAction>
          <Button variant="link" className="px-0 font-semibold text-primary">
            {t('view_all')}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-3">
          {badges.map((badge) => (
            <Item key={badge.id} asChild>
              <li className="px-0! py-0!">
                <ItemMedia variant="icon">
                  <Avatar className={cn('size-12', badge.iconBg)}>
                    <AvatarFallback className="bg-transparent text-2xl">
                      {badge.iconEmoji}
                    </AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    <h4 className="font-semibold text-sm">
                      {t(badge.titleKey)}
                    </h4>
                  </ItemTitle>
                  <ItemDescription className="text-muted-foreground text-xs">
                    {t(badge.dateKey)}
                  </ItemDescription>
                </ItemContent>
              </li>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
