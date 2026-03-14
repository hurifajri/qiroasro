'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { LocaleSelector } from '@/components/common/locale-selector';
import { ThemeSelector } from '@/components/common/theme-selector';
import { useMounted } from '@/hooks/use-mounted';
import { useIsScrolled } from '@/hooks/use-scroll-position';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface PublicHeaderProps {
  className?: string;
  userId?: string;
}

export function PublicHeader({ className, userId }: PublicHeaderProps) {
  const isScrolled = useIsScrolled();
  const { resolvedTheme } = useTheme();
  const { isMounted } = useMounted();
  const currentTheme = isMounted ? resolvedTheme : 'light';

  const pathname = usePathname();
  const isPlayground = pathname === '/playground';

  return (
    <header
      className={cn(
        'sticky top-0 flex items-center justify-between gap-2 bg-background/20 px-4 py-2 backdrop-blur-sm transition-[border-color] duration-200',
        isScrolled && !isPlayground ? 'border-b' : '',
        isPlayground && 'border-b',
        className,
      )}
    >
      <Link href="/" className="shrink-0 font-semibold text-xl">
        {!isMounted ? (
          <div className="h-7 w-24" />
        ) : currentTheme === 'light' ? (
          <Image
            src="/qiroasro-web-logo-light.png"
            alt="Qiroasro Logo"
            width={96}
            height={28}
            priority
            fetchPriority="high"
          />
        ) : (
          <Image
            src="/qiroasro-web-logo-dark.png"
            alt="Qiroasro Logo"
            width={96}
            height={28}
            priority
            fetchPriority="high"
          />
        )}
      </Link>
      <div className="flex items-center gap-2">
        <LocaleSelector userId={userId} />
        <ThemeSelector />
      </div>
    </header>
  );
}
