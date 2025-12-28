'use client';

import type { ColorMode } from '@xyflow/react';
import { MailIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LocaleSelector } from '@/components/common/locale-selector';
import { ThemeSelector } from '@/components/common/theme-selector';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useIsScrolled } from '@/hooks/use-scroll-position';
import { cn } from '@/lib/utils';
import type { Locale } from '@/stores/global';

interface PublicHeaderProps {
  locale: Locale;
  theme: ColorMode;
  className?: string;
}

export function PublicHeader({ locale, theme, className }: PublicHeaderProps) {
  const t = useTranslations('global');
  const isScrolled = useIsScrolled();
  const pathname = usePathname();
  const isPlayground = pathname === '/playground';

  return (
    <header
      className={cn(
        'sticky top-0 z-60 flex flex-col items-center justify-between gap-2 bg-background/20 px-4 py-2 backdrop-blur-sm transition-[border-color] duration-200 sm:flex-row',
        isScrolled && !isPlayground ? 'border-b' : '',
        isPlayground && 'border-b',
        className,
      )}
    >
      <Link href="/" className="shrink-0 font-semibold text-xl">
        {theme === 'light' ? (
          <Image
            src="/qiroasro-web-logo-light.png"
            alt="Qiroasro Logo"
            width={96}
            height={28}
            loading="eager"
          />
        ) : (
          <Image
            src="/qiroasro-web-logo-dark.png"
            alt="Qiroasro Logo"
            width={96}
            height={28}
            loading="eager"
          />
        )}
      </Link>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <LocaleSelector locale={locale} />
          <ThemeSelector theme={theme} />
        </div>
        {isPlayground && (
          <>
            <Separator orientation="vertical" />
            <Button className="cursor-pointer bg-linear-to-r from-accent-violet to-accent-violet-dark text-base text-white">
              <MailIcon />
              {t('misc.waitlist')}
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
