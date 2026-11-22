import { SettingsNavCard } from '@/features/user-profile/components/settings-nav-card';
import {
  MOCK_ACCOUNT_LINKS,
  MOCK_SUBSCRIPTION_LINKS,
  MOCK_SUPPORT_LINKS,
} from '@/features/user-profile/lib/settings-mock-data';

import { LogoutButton } from '../../../_components/logout-button';

interface SettingsSidebarProps {
  params: Promise<{ slug: string }>;
}

export default async function SettingsSidebar({
  params,
}: Readonly<SettingsSidebarProps>) {
  const { slug } = await params;

  return (
    <>
      <SettingsNavCard
        titleKey="account.title"
        links={MOCK_ACCOUNT_LINKS}
        activeId={slug}
      />
      <SettingsNavCard
        titleKey="subscription.title"
        links={MOCK_SUBSCRIPTION_LINKS}
      />
      <SettingsNavCard titleKey="support.title" links={MOCK_SUPPORT_LINKS} />
      <LogoutButton />
    </>
  );
}
