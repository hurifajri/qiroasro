'use client';

import type { ColorMode } from '@xyflow/react';
import { LocaleSelector } from '@/components/common/locale-selector';
import { ThemeSelector } from '@/components/common/theme-selector';
import { useIsScrolled } from '@/hooks/use-scroll-position';
import { cn } from '@/lib/utils';
import type { Locale } from '@/stores/global';

interface PublicHeaderProps {
  locale: Locale;
  theme: ColorMode;
  className?: string;
}

export function PublicHeader({ locale, theme, className }: PublicHeaderProps) {
  const isScrolled = useIsScrolled();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between gap-2 bg-background/80 px-4 py-2 backdrop-blur-xs transition-[border-color] duration-200',
        isScrolled ? 'border-b' : 'border-transparent border-b',
        className,
      )}
    >
      <span className="font-semibold text-xl">QiroAsro</span>
      <div className="flex items-center gap-2">
        <LocaleSelector locale={locale} />
        <ThemeSelector theme={theme} />
      </div>
    </header>
  );
}
