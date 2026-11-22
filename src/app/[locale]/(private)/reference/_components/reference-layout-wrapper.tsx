'use client';

import { MenuIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { getLocaleDir } from '@/i18n/locale';
import { usePathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

import { ReferenceSidebar } from './reference-sidebar';

export function ReferenceLayoutWrapper({
  children,
}: Readonly<React.PropsWithChildren>) {
  const t = useTranslations('reference_page.categories_menu');
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const dir = getLocaleDir(locale);
  const [isOpen, setIsOpen] = useState(false);

  const isRoot = pathname.endsWith('/reference');

  if (isRoot) return <>{children}</>;

  return (
    <div className="@container flex flex-col gap-6 @6xl/main:flex-row">
      {/* Mobile Trigger & Sidebar Sheet */}
      <div className="@6xl:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer justify-start"
            >
              <MenuIcon />
              {t('trigger')}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-3">
            <SheetTitle>{t('title')}</SheetTitle>
            <SheetDescription>{t('description')}</SheetDescription>
            <div className="no-scrollbar overflow-y-auto">
              <ReferenceSidebar onLinkClick={() => setIsOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="sticky top-6 hidden h-dvh border-e @6xl:block">
        <ScrollArea dir={dir} className="h-full w-72 pe-3">
          <ReferenceSidebar />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </aside>

      {children}
    </div>
  );
}
