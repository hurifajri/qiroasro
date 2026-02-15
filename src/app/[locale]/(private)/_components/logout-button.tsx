import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const t = useTranslations('settings_page');

  return (
    <Button variant="outline" className="uppercase">
      {t('sidebar.logout')}
    </Button>
  );
}
