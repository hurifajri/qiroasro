import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const t = useTranslations('global.private_layout');

  return (
    <Button variant="outline" className="uppercase">
      {t('logout')}
    </Button>
  );
}
