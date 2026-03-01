'use client';

import type { ColorMode } from '@xyflow/react';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getLocaleDir } from '@/i18n/locale';
import { useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { useGlobalStore } from '@/providers/global';

type ThemeSelectorProps = Readonly<{
  theme: ColorMode;
}>;

export function ThemeSelector({ theme }: ThemeSelectorProps) {
  const t = useTranslations('global.dark_mode');
  const locale = useLocale() as Locale;
  const dir = getLocaleDir(locale);
  const router = useRouter();
  const setTheme = useGlobalStore((s) => s.setTheme);
  const storeTheme = useGlobalStore((s) => s.theme);

  // Use store value (client) after hydration, fallback to server prop
  const currentTheme = storeTheme ?? theme;

  const handleThemeChange = (newTheme: ColorMode) => {
    setTheme(newTheme);
    // Refresh to re-render server components with new theme from cookies
    router.refresh();
  };

  return (
    <DropdownMenu dir={dir}>
      <DropdownMenuTrigger
        id="tour-theme-selector"
        className="flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
      >
        {currentTheme === 'light' ? (
          <SunIcon className="size-4" />
        ) : currentTheme === 'dark' ? (
          <MoonIcon className="size-4" />
        ) : (
          <MonitorIcon className="size-4" />
        )}
        <span className="sr-only">{t('title')}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleThemeChange('system')}>
          <MonitorIcon className="mr-2 size-4" />
          {t('mode_system')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('light')}>
          <SunIcon className="mr-2 size-4" />
          {t('mode_off')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
          <MoonIcon className="mr-2 size-4" />
          {t('mode_on')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
