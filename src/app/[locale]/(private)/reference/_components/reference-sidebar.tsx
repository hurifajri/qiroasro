'use client';

import { LockIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

import { CURRICULUM_TOPICS } from '../../_lib/curriculum';

interface ReferenceSidebarProps {
  onLinkClick?: () => void;
}

export function ReferenceSidebar({
  onLinkClick,
}: Readonly<ReferenceSidebarProps>) {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <nav className="flex flex-col gap-2">
      {CURRICULUM_TOPICS.map((category) => {
        const isActive = pathname.includes(`/reference/${category.slug}`);

        const content = (
          <div
            key={category.slug}
            className={cn(
              'relative flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition-colors',
              isActive && 'bg-primary/15 text-primary',
              !category.available && 'cursor-not-allowed opacity-50',
            )}
          >
            <span>{category.iconSymbol}</span>
            <span>{t(category.titleKey)}</span>
            {!category.available && (
              <LockIcon className="ml-auto size-5 shrink-0 text-muted-foreground" />
            )}
          </div>
        );

        if (!category.available) {
          return content;
        }

        return (
          <Link key={category.slug} href={category.href} onClick={onLinkClick}>
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
