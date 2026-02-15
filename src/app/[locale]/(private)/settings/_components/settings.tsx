import { LogoutButton } from '../../_components/logout-button';
import { SettingsNavCard } from '../../_components/settings-nav-card';
import {
  MOCK_ACCOUNT_LINKS,
  MOCK_SUBSCRIPTION_LINKS,
  MOCK_SUPPORT_LINKS,
} from '../_lib/mock-data';

export function Settings() {
  return (
    <div className="flex flex-col gap-4">
      <SettingsNavCard titleKey="account.title" links={MOCK_ACCOUNT_LINKS} />
      <SettingsNavCard
        titleKey="subscription.title"
        links={MOCK_SUBSCRIPTION_LINKS}
      />
      <SettingsNavCard titleKey="support.title" links={MOCK_SUPPORT_LINKS} />
      <LogoutButton />
    </div>
  );
}
