'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { REFERENCE_CATEGORIES } from '../_lib/reference';

interface ReferenceSidebarProps {
  onLinkClick?: () => void;
}

export function ReferenceSidebar({ onLinkClick }: ReferenceSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations('reference_page');

  return (
    <nav className="h-full overflow-y-auto pb-10 md:pt-4 md:pr-6">
      <div className="flex flex-col space-y-1">
        {REFERENCE_CATEGORIES.map((category) => {
          const isActive = pathname.includes(`/reference/${category.id}`);

          return (
            <Link
              key={category.id}
              href={category.href}
              onClick={onLinkClick}
              className={cn(
                'group flex items-center justify-between rounded-md border border-transparent px-2 py-1.5 font-medium text-sm hover:underline',
                isActive
                  ? 'bg-muted text-primary underline'
                  : 'text-muted-foreground',
                !category.available && 'pointer-events-none opacity-50',
              )}
            >
              <span className="flex items-center gap-2">
                <span>{category.iconSymbol}</span>
                <span>{t(category.titleKey)}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
