'use client';

import { MonitorSmartphoneIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function MobileUnsupported() {
  const t = useTranslations('playground_page.mobile_unsupported');

  return (
    <div className="absolute inset-0 z-4 flex flex-col items-center justify-center gap-3 bg-background/95 px-6 text-center backdrop-blur-sm">
      <MonitorSmartphoneIcon className="size-10 text-muted-foreground" />
      <h2 className="font-semibold text-lg">{t('title')}</h2>
      <p className="max-w-sm text-muted-foreground text-sm">
        {t('description')}
      </p>
    </div>
  );
}
