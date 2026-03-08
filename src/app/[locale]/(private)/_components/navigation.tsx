'use client';

import {
  BookOpenIcon,
  CircleHelpIcon,
  DumbbellIcon,
  EllipsisIcon,
  GiftIcon,
  HomeIcon,
  LogOutIcon,
  SettingsIcon,
  StoreIcon,
  TrophyIcon,
  UserIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import type { NavItem } from '../_schemas/private';

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  House: HomeIcon,
  BookOpen: BookOpenIcon,
  Dumbbell: DumbbellIcon,
  Trophy: TrophyIcon,
  Gift: GiftIcon,
  Store: StoreIcon,
  User: UserIcon,
};

interface SidebarNavProps {
  items: NavItem[];
}

/**
 * More menu dropdown component.
 */
function MoreMenu() {
  const t = useTranslations('global.private_layout.nav');
  const isLg = useMediaQuery('(width >= 64rem)');
  const pathname = usePathname();
  const router = useRouter();
  const isActive =
    pathname.endsWith('/settings') || pathname.includes('/settings');

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
          router.refresh();
        },
      },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex items-center gap-3 rounded-xl p-3 font-medium text-sm transition-colors',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        {isLg ? (
          <EllipsisIcon />
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <EllipsisIcon />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{t('more')}</p>
            </TooltipContent>
          </Tooltip>
        )}
        <span className="hidden lg:inline">{t('more')}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <DropdownMenuItem asChild>
          <Link
            href="/settings/preferences"
            className="flex items-center gap-2"
          >
            <SettingsIcon className="size-4" />
            {t('settings')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/help" className="flex items-center gap-2">
            <CircleHelpIcon className="size-4" />
            {t('help')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOutIcon className="size-4" />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
        const Icon = iconMap[item.iconName] ?? HomeIcon;

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
              <Icon />
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Icon />
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

      {/* More menu */}
      <MoreMenu />
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
        const Icon = iconMap[item.iconName];

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
            <Icon />
          </Link>
        );
      })}
    </nav>
  );
}
