'use client';

import { Button } from '@/components/ui/button';
import { useGlobalStore } from '@/providers/global';
import type { Locale } from '@/stores/global';

type LocaleSelectorProps = Readonly<{
  locale: Locale;
}>;

export function LocaleSelector({ locale }: LocaleSelectorProps) {
  const { setLocale } = useGlobalStore((state) => state);

  return (
    <Button
      className="rounded-full text-muted-foreground uppercase"
      onClick={() => setLocale(locale === 'en' ? 'id' : 'en')}
      size="icon"
      variant="outline"
    >
      {locale}
    </Button>
  );
}
