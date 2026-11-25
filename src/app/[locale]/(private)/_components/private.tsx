'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { getUserProfileByUserIdOpt } from '@/features/user-profile/queries/user-profile';
import { useMediaQuery } from '@/hooks/use-media-query';
import { usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

import { MOCK_NAV_ITEMS } from '../_lib/mock-data';
import { BottomNav } from './navigation';
import { LeftSidebar, RightSidebar } from './sidebar';

type PrivateProps = React.PropsWithChildren & {
  userId: string;
  header: React.ReactNode;
  sidebar: React.ReactNode;
};

/**
 * Shared layout shell for private pages (learn, sections, profile, etc.)
 * Includes: left sidebar, stats bar header, right sidebar widgets, bottom nav
 */
export function Private({ children, userId, header, sidebar }: PrivateProps) {
  const pathname = usePathname();
  const isMaxMd = useMediaQuery('(width < 48rem)');

  // Fetch real user profile — data is already prefetched in layout.tsx (no waterfall)
  const { data: userProfile } = useSuspenseQuery(
    getUserProfileByUserIdOpt(userId),
  );

  // Use real username for profile link
  const username = userProfile?.username ?? userId;

  // Update nav items based on current path, inject real profile link
  const leftNavItems = MOCK_NAV_ITEMS.map((item) => {
    const href = item.id === 'profile' ? `/profile/${username}` : item.href;

    return {
      ...item,
      href,
      isActive:
        pathname.endsWith(href) ||
        pathname.includes(href) ||
        (pathname === '/sections' && item.href === '/learn') ||
        (isMaxMd &&
          pathname.startsWith('/settings') &&
          item.href.startsWith('/profile')),
    };
  });

  const bottomNavItems = leftNavItems.filter((item) =>
    [
      'learn',
      'practice',
      'reference',
      'leaderboard',
      'quests',
      'profile',
    ].includes(item.id),
  );

  const hasMobileHeader = !['/leaderboard', '/quests'].includes(pathname);

  return (
    <div className="flex min-h-dvh justify-center bg-background">
      {/* Left Sidebar - Desktop only */}
      {!isMaxMd && <LeftSidebar navItems={leftNavItems} />}

      {/* Top Stats Bar */}
      {isMaxMd && hasMobileHeader && (
        <header className="fixed inset-x-0 top-0 z-50 p-3">{header}</header>
      )}

      {/* Main Content */}
      <main
        className={cn(
          '@container/main w-full min-w-0 px-3 pb-20.5 sm:px-6 md:py-6',
          hasMobileHeader ? 'pt-15.5' : 'pt-3',
        )}
      >
        {children}
      </main>

      {/* Right Sidebar - Desktop only */}
      {!isMaxMd && <RightSidebar>{sidebar}</RightSidebar>}

      {/* Bottom Navigation - Mobile only */}
      {isMaxMd && (
        <footer className="fixed inset-x-0 bottom-0 z-50 p-3">
          <BottomNav items={bottomNavItems} />
        </footer>
      )}
    </div>
  );
}
