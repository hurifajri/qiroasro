'use client';

import type { ColorMode } from '@xyflow/react';
import { CircleQuestionMarkIcon, MailIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { LocaleSelector } from '@/components/common/locale-selector';
import { ThemeSelector } from '@/components/common/theme-selector';
import { WaitlistForm } from '@/components/common/waitlist-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  const [isWaitlistDialogOpen, setIsWaitlistDialogOpen] = useState(false);

  const pathname = usePathname();
  const isPlayground = pathname === '/playground';

  return (
    <>
      <header
        className={cn(
          'sticky top-0 flex items-center justify-between gap-2 bg-background/20 px-4 py-2 backdrop-blur-sm transition-[border-color] duration-200',
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
              <Button
                id="tour-waitlist-button"
                onClick={() => setIsWaitlistDialogOpen(true)}
                className="cursor-pointer bg-linear-to-r from-accent-violet to-accent-violet-dark text-base text-white"
              >
                <MailIcon />
                {t('development.waitlist')}
              </Button>
            </>
          )}
        </div>
      </header>

      {isWaitlistDialogOpen && (
        <Dialog open={isWaitlistDialogOpen} onOpenChange={setIsWaitlistDialogOpen}>
          <DialogContent>
            <DialogHeader className="-mx-4 flex flex-row items-center gap-2 border-b px-4 pb-2">
              <CircleQuestionMarkIcon className="text-muted-foreground" />
              <DialogTitle>{t('development.more_comprehensive')}</DialogTitle>
            </DialogHeader>
            <WaitlistForm source="public_header" isPlain />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
