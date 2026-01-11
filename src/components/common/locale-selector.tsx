'use client';

import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from '@/i18n/navigation';

export function LocaleSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = () => {
    const newLocale = locale === 'en' ? 'id' : 'en';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Button
      id="tour-locale-selector"
      className="rounded-full text-muted-foreground uppercase"
      onClick={handleLocaleChange}
      size="icon"
      variant="outline"
    >
      {locale}
    </Button>
  );
}
