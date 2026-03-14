import type { NavItem } from '../_schemas/private';
import { SidebarNav } from './navigation';

interface LeftSidebarProps {
  navItems: NavItem[];
}

export function LeftSidebar({ navItems }: LeftSidebarProps) {
  return (
    <aside className="hidden shrink-0 border-r bg-card p-3 sm:block sm:w-18.25 lg:w-52">
      <div className="sticky top-4">
        <SidebarNav items={navItems} />
      </div>
    </aside>
  );
}

export function RightSidebar({ children }: React.PropsWithChildren) {
  return (
    <aside className="hidden shrink-0 border-l bg-card p-4 md:block md:w-72 lg:w-96">
      <div className="sticky top-4 flex flex-col gap-4">{children}</div>
    </aside>
  );
}
