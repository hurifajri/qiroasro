'use client';

import type { ColorMode } from '@xyflow/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LocaleSelector } from '@/components/common/locale-selector';
import { ThemeSelector } from '@/components/common/theme-selector';
import { env } from '@/env';
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
  const pathname = usePathname();
  const isPlayground = pathname === '/playground';

  return (
    <header
      className={cn(
        'sticky top-0 z-60 flex items-center justify-between gap-2 bg-background/20 px-4 py-2 backdrop-blur-sm transition-[border-color] duration-200',
        isScrolled && !isPlayground ? 'border-b' : '',
        isPlayground && 'border-b',
        className,
      )}
    >
      <Link href="/" className="font-semibold text-xl">
        {env.NEXT_PUBLIC_APP_NAME}
      </Link>
      <div className="flex items-center gap-2">
        <LocaleSelector locale={locale} />
        <ThemeSelector theme={theme} />
      </div>
    </header>
  );
}
