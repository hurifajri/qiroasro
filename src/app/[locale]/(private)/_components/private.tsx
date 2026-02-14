'use client';

import { usePathname } from '@/i18n/navigation';
import { MOCK_NAV_ITEMS, MOCK_USER_STATS } from '../_lib/mock-data';
import { BottomNav } from './navigation';
import { LeftSidebar, RightSidebar } from './sidebar';
import { StatList } from './stat-list';

type PrivateProps = React.PropsWithChildren & {
  sidebar: React.ReactNode;
};

/**
 * Shared layout shell for private pages (learn, sections, profile, etc.)
 * Includes: left sidebar, stats bar header, right sidebar widgets, bottom nav
 */
export function Private({ children, sidebar }: PrivateProps) {
  const pathname = usePathname();

  // Update nav items based on current path
  const navItems = MOCK_NAV_ITEMS.map((item) => ({
    ...item,
    isActive: pathname.endsWith(item.href) || pathname.includes(item.href),
  }));

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Left Sidebar - Desktop only */}
      <LeftSidebar navItems={navItems} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Stats Bar */}
        <header className="sticky top-0 z-20 border-b bg-background px-4 py-2 md:hidden">
          <StatList stats={MOCK_USER_STATS} />
        </header>

        {/* Page Content */}
        <div className="mx-auto max-w-xl px-4 py-6 pb-24.25 sm:px-6 sm:pb-6">
          {children}
        </div>
      </main>

      {/* Right Sidebar - Desktop only */}
      <RightSidebar>{sidebar}</RightSidebar>

      {/* Bottom Navigation - Mobile only */}
      <BottomNav items={navItems} />
    </div>
  );
}
