'use client';

import { LocaleSelector } from '@/components/locale-selector';
import { ThemeSelector } from '@/components/theme-selector';
import type { Locale, Theme } from '@/stores/global';

type LocaleThemeSelectorProps = Readonly<{
  locale: Locale;
  theme: Theme;
}>;

export function LocaleThemeSelector({
  locale,
  theme,
}: LocaleThemeSelectorProps) {
  return (
    <div className="fixed right-0 bottom-0 z-50 flex items-center justify-center gap-1 p-5">
      <LocaleSelector locale={locale} />
      <ThemeSelector theme={theme} />
    </div>
  );
}
