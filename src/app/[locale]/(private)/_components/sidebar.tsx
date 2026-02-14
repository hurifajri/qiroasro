import { useTranslations } from 'next-intl';
import type { NavItem } from '../_schemas/private';
import { SidebarNav } from './navigation';

interface LeftSidebarProps {
  navItems: NavItem[];
}

export function LeftSidebar({ navItems }: LeftSidebarProps) {
  return (
    <aside className="hidden w-18.25 shrink-0 border-r bg-card p-3 sm:block lg:w-56">
      <div className="sticky top-4">
        <SidebarNav items={navItems} />
      </div>
    </aside>
  );
}

export function RightSidebar({ children }: React.PropsWithChildren) {
  const t = useTranslations('global.private_layout');

  return (
    <aside className="hidden w-80 shrink-0 border-l bg-card p-4 md:block">
      <div className="sticky top-4 flex flex-col gap-4">
        <h2 className="sr-only">{t('right_sidebar_title')}</h2>
        {children}
      </div>
    </aside>
  );
}
