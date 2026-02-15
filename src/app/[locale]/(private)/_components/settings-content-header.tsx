import { SettingsIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export function SettingsContentHeader() {
  const t = useTranslations('global.private_layout');

  return (
    <div className="relative flex items-center justify-center">
      <h2 className="font-semibold text-lg">{t('nav.profile')}</h2>
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
