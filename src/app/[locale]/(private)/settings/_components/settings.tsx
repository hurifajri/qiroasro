'use client';

import { useEffect } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useMounted } from '@/hooks/use-mounted';
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
  const { isMounted } = useMounted();
  const isMaxMd = useMediaQuery('(width < 48rem)');

  // Redirect only after mounted and confirmed not mobile
  useEffect(() => {
    if (isMounted && !isMaxMd) {
      router.replace('/settings/preferences');
    }
  }, [isMounted, isMaxMd, router]);

  return (
    <div className="flex flex-col gap-3">
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
