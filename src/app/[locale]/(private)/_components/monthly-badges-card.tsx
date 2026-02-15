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
import type { MonthlyBadge } from '../_schemas/private';
import { MonthlyBadgesRow } from './monthly-badges-row';

interface MonthlyBadgesCardProps {
  badges: MonthlyBadge[];
}

export function MonthlyBadgesCard({ badges }: MonthlyBadgesCardProps) {
  const t = useTranslations('quests_page');

  return (
    <Card>
      <CardHeader className="flex w-full items-center justify-between gap-2">
        <CardTitle>{t('monthly_badges')}</CardTitle>
        <CardAction>
          <Link
            href="/friend-updates"
            className={cn(
              buttonVariants({ variant: 'link' }),
              'px-0 uppercase',
            )}
          >
            {t('view_all')}
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {badges.map((badge) => (
            <MonthlyBadgesRow key={badge.id} badge={badge} />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
