'use client';

import { SparklesIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface LevelCardProps {
  onUpgradeClick?: () => void;
}

/**
 * Premium upgrade / level up card widget.
 */
export function LevelCard({ onUpgradeClick }: LevelCardProps) {
  const t = useTranslations('global.private_layout');

  return (
    <Card className="bg-linear-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10">
      <CardHeader>
        <CardTitle>
          <Badge className="border-none bg-linear-to-r from-violet-500 to-fuchsia-500 font-bold">
            <SparklesIcon className="size-3" />
            SUPER
          </Badge>
          <h3 className="font-bold">{t('level_card.title')}</h3>
        </CardTitle>
        <CardDescription className="sr-only">
          {t('level_card.title')}
        </CardDescription>
        <CardAction>
          <div className="size-12 rounded-full bg-linear-to-br from-violet-400 to-fuchsia-500 opacity-80" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          {t('level_card.description')}
        </p>
      </CardContent>
      <CardFooter className="border-t-0 bg-transparent pt-0">
        <Button
          onClick={onUpgradeClick}
          className="w-full bg-linear-to-r from-violet-500 to-fuchsia-500 font-bold text-white hover:from-violet-600 hover:to-fuchsia-600"
        >
          {t('level_card.cta')}
        </Button>
      </CardFooter>
    </Card>
  );
}
