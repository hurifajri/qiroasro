'use client';

import { MenuIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ReferenceSidebar } from './reference-sidebar';

export function ReferenceLayoutWrapper({ children }: React.PropsWithChildren) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isRoot = pathname.endsWith('/reference');

  useEffect(() => {
    setIsOpen(false);
  }, []);

  if (isRoot) return children;

  return (
    <div className="@container flex @3xl/main:flex-row flex-col gap-6">
      {/* Mobile Trigger & Sidebar Sheet */}
      <div className="@3xl:hidden w-full">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <MenuIcon />
              Menu Referensi
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetTitle>Menu Navigasi</SheetTitle>
            <SheetDescription>Navigasi halaman referensi</SheetDescription>
            <ReferenceSidebar onLinkClick={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="sticky top-0 @3xl:block hidden h-dvh">
        <ScrollArea className="h-full w-72">
          <ReferenceSidebar />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </aside>

      {children}
    </div>
  );
}
