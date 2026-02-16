'use client';

import { useEffect, useState } from 'react';
import { useMobile } from '@/hooks/use-mobile';
import { useRouter } from '@/i18n/navigation';
import { LogoutButton } from '../../_components/logout-button';
import { SettingsNavCard } from '../../_components/settings-nav-card';
import {
  MOCK_ACCOUNT_LINKS,
  MOCK_SUBSCRIPTION_LINKS,
  MOCK_SUPPORT_LINKS,
} from '../_lib/mock-data';

export function Settings() {
  const router = useRouter();
  const isMobile = useMobile();
  const [isMounted, setIsMounted] = useState(false);

  // Track when component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect only after mounted and confirmed not mobile
  // biome-ignore lint/correctness/useExhaustiveDependencies: <router won't be changed>
  useEffect(() => {
    if (isMounted && !isMobile) {
      router.replace('/settings/preferences');
    }
  }, [isMounted, isMobile]);

  // Show nothing while checking or redirecting
  if (!isMounted || !isMobile) {
    return null;
  }

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
