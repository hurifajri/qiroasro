'use client';

import { MonitorSmartphoneIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface MobileUnsupportedProps {
  onSwitchToLetter: () => void;
}

export function MobileUnsupported({
  onSwitchToLetter,
}: MobileUnsupportedProps) {
  const t = useTranslations('playground_page.mobile_unsupported');

  return (
    <div className="absolute inset-0 z-4 flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm">
      <Card className="w-full!">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-semibold text-foreground text-xl">
            <MonitorSmartphoneIcon className="size-5" />
            {t('title')}
          </CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent />
        <CardFooter className="flex items-center justify-end">
          <Button onClick={onSwitchToLetter}>{t('switch_to_letter')}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
