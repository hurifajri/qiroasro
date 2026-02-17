'use client';

import { useMobile } from '@/hooks/use-mobile';
import { usePathname } from '@/i18n/navigation';
import { MOCK_NAV_ITEMS } from '../_lib/mock-data';
import { BottomNav } from './navigation';
import { LeftSidebar, RightSidebar } from './sidebar';

type PrivateProps = React.PropsWithChildren & {
  header: React.ReactNode;
  sidebar: React.ReactNode;
};

/**
 * Shared layout shell for private pages (learn, sections, profile, etc.)
 * Includes: left sidebar, stats bar header, right sidebar widgets, bottom nav
 */
export function Private({ children, header, sidebar }: PrivateProps) {
  const pathname = usePathname();
  const isMobile = useMobile();

  // Update nav items based on current path
  const leftNavItems = MOCK_NAV_ITEMS.map((item) => {
    return {
      ...item,
      isActive:
        pathname.endsWith(item.href) ||
        pathname.includes(item.href) ||
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
      <main className="flex-1 overflow-x-hidden">
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
