'use client';

import { ChevronLeftIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { buttonVariants } from '@/components/ui/button';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export function SettingsContentHeader() {
  const t = useTranslations('global.private_layout');
  const pathname = usePathname();

  // Extract slug from pathname (e.g., "/settings/profile" -> "profile")
  const slug = pathname.split('/').pop() || 'preferences';

  return (
    <div className="relative flex items-center justify-center">
      <Link
        href="/settings"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'absolute left-0 px-0',
        )}
      >
        <ChevronLeftIcon />
      </Link>
      <h1 className="font-bold text-xl">{t(`account.${slug}`)}</h1>
    </div>
  );
}
