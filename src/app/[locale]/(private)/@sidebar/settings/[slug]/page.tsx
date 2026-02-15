import { LogoutButton } from '../../../_components/logout-button';
import { SettingsNavCard } from '../../../_components/settings-nav-card';
import {
  MOCK_ACCOUNT_LINKS,
  MOCK_SUBSCRIPTION_LINKS,
  MOCK_SUPPORT_LINKS,
} from '../../../settings/_lib/mock-data';

export default async function SettingsSidebar({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Determine active link based on slug
  const activeId = slug;

  return (
    <>
      <SettingsNavCard
        titleKey="sidebar.settings.title"
        links={MOCK_ACCOUNT_LINKS}
        activeId={activeId}
      />
      <SettingsNavCard
        titleKey="sidebar.subscription.title"
        links={MOCK_SUBSCRIPTION_LINKS}
      />
      <SettingsNavCard
        titleKey="sidebar.support.title"
        links={MOCK_SUPPORT_LINKS}
      />
      <LogoutButton />
    </>
  );
}
