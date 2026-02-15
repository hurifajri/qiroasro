import { LogoutButton } from '../../../_components/logout-button';
import { SettingsNavCard } from '../../../_components/settings-nav-card';
import {
  MOCK_ACCOUNT_LINKS,
  MOCK_SUBSCRIPTION_LINKS,
  MOCK_SUPPORT_LINKS,
} from '../../../settings/_lib/mock-data';

interface SettingsSidebarProps {
  params: Promise<{ slug: string }>;
}

export default async function SettingsSidebar({
  params,
}: SettingsSidebarProps) {
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
