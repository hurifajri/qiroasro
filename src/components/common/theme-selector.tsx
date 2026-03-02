'use client';

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMounted } from '@/hooks/use-mounted';
import { getLocaleDir } from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';

const themeSelectorClassName =
  'flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50';

export function ThemeSelector() {
  const t = useTranslations('global.color_mode');
  const locale = useLocale() as Locale;
  const dir = getLocaleDir(locale);
  const { theme, setTheme } = useTheme();
  const { isMounted } = useMounted();

  if (!isMounted) {
    return <div className={themeSelectorClassName} />;
  }

  return (
    <DropdownMenu dir={dir}>
      <DropdownMenuTrigger
        id="tour-theme-selector"
        className={themeSelectorClassName}
      >
        {theme === 'system' ? (
          <MonitorIcon className="size-4" />
        ) : theme === 'dark' ? (
          <MoonIcon className="size-4" />
        ) : (
          <SunIcon className="size-4" />
        )}
        <span className="sr-only">{t('title')}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <MonitorIcon className="mr-2 size-4" />
          {t('mode_system')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <SunIcon className="mr-2 size-4" />
          {t('mode_light')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <MoonIcon className="mr-2 size-4" />
          {t('mode_dark')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
