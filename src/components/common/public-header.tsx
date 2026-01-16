'use client';

import type { ColorMode } from '@xyflow/react';
import { CircleQuestionMarkIcon, MailIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { LocaleSelector } from '@/components/common/locale-selector';
import { ThemeSelector } from '@/components/common/theme-selector';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useIsScrolled } from '@/hooks/use-scroll-position';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

/**
 * Lazy load WaitlistForm - only needed when dialog is open
 */
const WaitlistForm = dynamic(
  () =>
    import('@/components/common/waitlist-form').then((mod) => mod.WaitlistForm),
  { ssr: false },
);

interface PublicHeaderProps {
  theme: ColorMode;
  className?: string;
}

export function PublicHeader({ theme, className }: PublicHeaderProps) {
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
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <LocaleSelector />
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
        <Dialog
          open={isWaitlistDialogOpen}
          onOpenChange={setIsWaitlistDialogOpen}
        >
          <DialogContent>
            <DialogHeader className="-mx-4 flex flex-row items-center gap-2 border-b px-4 pb-2">
              <CircleQuestionMarkIcon className="text-muted-foreground" />
              <DialogTitle>{t('development.more_comprehensive')}</DialogTitle>
              <DialogDescription className="sr-only">
                {t('development.more_comprehensive')}
              </DialogDescription>
            </DialogHeader>
            <WaitlistForm source="public_header" isPlain />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
