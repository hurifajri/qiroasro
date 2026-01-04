'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useGlobalStore } from '@/providers/global';
import type { Locale } from '@/stores/global';

type LocaleSelectorProps = Readonly<{
  locale: Locale;
}>;

export function LocaleSelector({ locale }: LocaleSelectorProps) {
  const router = useRouter();
  const setLocale = useGlobalStore((s) => s.setLocale);
  const storeLocale = useGlobalStore((s) => s.locale);

  // Use store value (client) after hydration, fallback to server prop
  const currentLocale = storeLocale ?? locale;

  const handleLocaleChange = () => {
    const newLocale = currentLocale === 'en' ? 'id' : 'en';
    setLocale(newLocale);
    // Refresh to re-render server components with new locale from cookies
    router.refresh();
  };

  return (
    <Button
      id="tour-locale-selector"
      className="rounded-full text-muted-foreground uppercase"
      onClick={handleLocaleChange}
      size="icon"
      variant="outline"
    >
      {currentLocale}
    </Button>
  );
}
