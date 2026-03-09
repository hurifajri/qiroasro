'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useMobile } from '@/hooks/use-mobile';
import { usePathname } from '@/i18n/navigation';
import { MOCK_NAV_ITEMS } from '../_lib/mock-data';
import { getUserProfileByUserIdOpt } from '../_queries/user-profile';
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
  const { isMobile } = useMobile();

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
        (isMobile &&
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
    <div className="flex min-h-dvh bg-background">
      {/* Left Sidebar - Desktop only */}
      {!isMobile && <LeftSidebar navItems={leftNavItems} />}

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        {/* Top Stats Bar */}
        {isMobile && hasMobileHeader && (
          <header className="sticky top-0 z-20 border-b bg-background px-4 py-2 md:hidden">
            {header}
          </header>
        )}

        {/* Page Content */}
        <div className="mx-auto max-w-xl px-4 py-6 pb-24.25 sm:px-6 sm:pb-6">
          {children}
        </div>
      </main>

      {/* Right Sidebar - Desktop only */}
      {!isMobile && <RightSidebar>{sidebar}</RightSidebar>}

      {/* Bottom Navigation - Mobile only */}
      <BottomNav items={bottomNavItems} />
    </div>
  );
}
