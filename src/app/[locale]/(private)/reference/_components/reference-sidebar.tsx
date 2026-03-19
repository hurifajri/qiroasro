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
    <nav className="flex flex-col gap-2">
      {REFERENCE_CATEGORIES.map((category) => {
        const isActive = pathname.includes(`/reference/${category.id}`);

        return (
          <Link
            key={category.id}
            href={category.href}
            onClick={onLinkClick}
            className={cn(
              'flex items-center gap-3 rounded-xl p-3 font-medium text-sm transition-colors',
              isActive
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              !category.available &&
                'pointer-events-none cursor-not-allowed opacity-50',
            )}
          >
            <span>{category.iconSymbol}</span>
            <span>{t(category.titleKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
