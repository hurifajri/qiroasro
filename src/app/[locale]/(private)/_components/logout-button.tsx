import { LogOutIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const t = useTranslations('settings_page');

  return (
    <Button variant="outline" className="w-full gap-2">
      <LogOutIcon className="size-4" />
      {t('sidebar.logout')}
    </Button>
  );
}
