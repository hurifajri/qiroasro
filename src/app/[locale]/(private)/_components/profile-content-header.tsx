import { SettingsIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export function ProfileContentHeader() {
  const t = useTranslations('global.private_layout');

  return (
    <div className="relative flex items-center justify-center rounded-xl border bg-background/10 p-2 backdrop-blur-sm">
      <h1 className="font-bold text-lg leading-none">{t('nav.profile')}</h1>
      <Link
        href="/settings"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'absolute right-0 px-0',
        )}
      >
        <SettingsIcon />
      </Link>
    </div>
  );
}
