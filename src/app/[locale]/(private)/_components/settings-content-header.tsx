'use client';

import { ChevronLeftIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/components/ui/button';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export function SettingsContentHeader() {
  const t = useTranslations('global.private_layout');
  const pathname = usePathname();
  const isMobileSettings = pathname === '/settings';

  // Extract slug from pathname (e.g., "/settings/profile" -> "profile")
  const lastSegment = pathname.split('/').pop();
  const slug =
    lastSegment && lastSegment.length > 0 ? lastSegment : 'preferences';

  return (
    <div className="relative flex items-center justify-center rounded-xl border bg-background/10 p-2 backdrop-blur-sm">
      {!isMobileSettings && (
        <Link
          href="/settings"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'absolute left-0 px-0',
          )}
        >
          <ChevronLeftIcon />
        </Link>
      )}
      <h1 className="text-xl leading-none font-bold">
        {isMobileSettings ? t('nav.settings') : t(`account.${slug}`)}
      </h1>
    </div>
  );
}
