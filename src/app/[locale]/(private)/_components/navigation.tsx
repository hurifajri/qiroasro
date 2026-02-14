'use client';

import {
  BookOpenIcon,
  DumbbellIcon,
  HomeIcon,
  LayoutGridIcon,
  TrophyIcon,
  UserIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { NavItem } from '../_schemas/private';

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  House: HomeIcon,
  BookOpen: BookOpenIcon,
  Dumbbell: DumbbellIcon,
  LayoutGrid: LayoutGridIcon,
  Trophy: TrophyIcon,
  User: UserIcon,
};

interface SidebarNavProps {
  items: NavItem[];
}

/**
 * Desktop sidebar navigation.
 */
export function SidebarNav({ items }: SidebarNavProps) {
  const t = useTranslations('global.private_layout');
  const isLg = useMediaQuery('(width >= 64rem)');

  return (
    <nav className="flex flex-col gap-2">
      {items.map((item) => {
        const IconComponent = iconMap[item.iconName] ?? HomeIcon;

        return (
          <Link
            key={item.id}
            href={item.href}
            title={t(item.labelKey)}
            className={cn(
              'flex items-center gap-3 rounded-xl p-3 font-medium text-sm transition-colors',
              item.isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {isLg ? (
              <IconComponent className="size-6" />
            ) : (
              <Tooltip>
                <TooltipTrigger>
                  <IconComponent className="size-6" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{t(item.labelKey)}</p>
                </TooltipContent>
              </Tooltip>
            )}
            <span className="hidden lg:inline">{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

interface BottomNavProps {
  items: NavItem[];
}

/**
 * Mobile bottom navigation.
 */
export function BottomNav({ items }: BottomNavProps) {
  const t = useTranslations('global.private_layout');

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t bg-background/95 px-2 py-2 backdrop-blur-sm sm:hidden">
      {items.map((item) => {
        const IconComponent = iconMap[item.iconName];

        return (
          <Link
            key={item.id}
            href={item.href}
            title={t(item.labelKey)}
            className={cn(
              'flex items-center justify-center rounded-xl p-2 transition-colors',
              item.isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <IconComponent className="size-6" />
          </Link>
        );
      })}
    </nav>
  );
}
