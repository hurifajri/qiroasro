'use client';

import { useTranslations } from 'next-intl';

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { SuperBadge } from './super-badge';
import { SuperButton } from './super-button';

/**
 * Premium upgrade / level up card widget.
 */
export function LevelCard() {
  const t = useTranslations('global.private_layout');

  function handleUpgradeClick() {
    console.log('Upgrade clicked');
  }

  return (
    <Card className="bg-linear-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10">
      <CardHeader>
        <CardTitle className="flex flex-col gap-1">
          <SuperBadge />
          {t('level_card.title')}
        </CardTitle>
        <CardAction>
          <div className="size-12 rounded-full bg-linear-to-br from-violet-400 to-fuchsia-500 opacity-80" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{t('level_card.description')}</p>
      </CardContent>
      <CardFooter className="border-t-0 bg-transparent pt-0">
        <SuperButton onClick={handleUpgradeClick}>
          {t('level_card.cta')}
        </SuperButton>
      </CardFooter>
    </Card>
  );
}
