'use client';

import { useLocale } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LOCALE_CONFIG } from '@/i18n/config';
import { getLocaleDir } from '@/i18n/locale';
import { usePathname, useRouter } from '@/i18n/navigation';
import { type Locale, routing } from '@/i18n/routing';
import { updateUserLocale } from '@/services/user-locale';

interface LocaleSelectorProps {
  userId?: string;
}

export function LocaleSelector({ userId }: LocaleSelectorProps) {
  const locale = useLocale() as Locale;
  const dir = getLocaleDir(locale);
  const router = useRouter();
  const pathname = usePathname();
  const currentConfig = LOCALE_CONFIG[locale];

  function handleLocaleChange(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
    if (userId) {
      void updateUserLocale(userId, newLocale);
    }
  }

  return (
    <DropdownMenu dir={dir}>
      <DropdownMenuTrigger
        id="tour-locale-selector"
        className="size-8 rounded-full border border-border bg-background text-xl hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
      >
        {currentConfig.flag}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {routing.locales.map((l) => (
          <DropdownMenuItem key={l} onClick={() => handleLocaleChange(l)}>
            <span className="mr-2">{LOCALE_CONFIG[l].flag}</span>
            {LOCALE_CONFIG[l].name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
