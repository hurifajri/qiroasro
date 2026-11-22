import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { Separator } from '@/components/ui/separator';
import {
  MOCK_DAILY_REMINDER,
  MOCK_GENERAL_NOTIFICATIONS,
  MOCK_LESSON_PREFERENCES,
  MOCK_PRIVACY_SETTINGS,
  MOCK_SOCIAL_ACCOUNTS,
} from '@/features/user-profile/lib/settings-mock-data';
import { getUserProfileByUserIdOpt } from '@/features/user-profile/queries/user-profile';
import { auth } from '@/lib/auth';

import { Notifications } from './_components/notifications';
import { Preferences } from './_components/preferences';
import { PrivacySettings } from './_components/privacy-settings';
import { Profile } from './_components/profile';
import { SocialAccounts } from './_components/social-accounts';

interface SettingsPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Valid settings slugs
const VALID_SLUGS = [
  'account',
  'preferences',
  'profile',
  'notifications',
  'social',
  'privacy',
  'courses',
] as const;

type SettingsSlug = (typeof VALID_SLUGS)[number];

export async function generateMetadata({
  params,
}: SettingsPageProps): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'settings_page.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  };
}

export default async function SettingsPage({
  params,
}: Readonly<SettingsPageProps>) {
  const { locale, slug } = await params;

  // Validate slug
  if (!VALID_SLUGS.includes(slug as SettingsSlug)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'settings_page' });

  // Conditional rendering based on slug
  if (slug === 'preferences') {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id ?? '';

    return (
      <>
        <h1 className="hidden pb-3 text-xl font-bold md:mx-auto md:block md:max-w-3xl">
          {t('preferences.title')}
        </h1>
        <Separator className="mb-6 hidden md:mx-auto md:block md:max-w-3xl" />
        <Preferences
          userId={userId}
          lessonPreferences={MOCK_LESSON_PREFERENCES}
        />
      </>
    );
  }

  if (slug === 'profile') {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id ?? '';

    // Prefetch profile so the Profile component gets it instantly
    const queryClient = new QueryClient();
    if (userId) {
      await queryClient.prefetchQuery(getUserProfileByUserIdOpt(userId));
    }

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <h1 className="hidden pb-3 text-xl font-bold md:mx-auto md:block md:max-w-3xl">
          {t('profile.title')}
        </h1>
        <Separator className="mb-6 hidden md:mx-auto md:block md:max-w-3xl" />
        <Profile userId={userId} />
      </HydrationBoundary>
    );
  }

  if (slug === 'notifications') {
    return (
      <>
        <h1 className="hidden pb-3 text-xl font-bold md:mx-auto md:block md:max-w-3xl">
          {t('notifications.title')}
        </h1>
        <Separator className="mb-6 hidden md:mx-auto md:block md:max-w-3xl" />
        <Notifications
          generalNotifications={MOCK_GENERAL_NOTIFICATIONS}
          dailyReminder={MOCK_DAILY_REMINDER}
        />
      </>
    );
  }

  if (slug === 'social') {
    return (
      <>
        <h1 className="hidden pb-3 text-xl font-bold md:mx-auto md:block md:max-w-3xl">
          {t('social.title')}
        </h1>
        <Separator className="mb-6 hidden md:mx-auto md:block md:max-w-3xl" />
        <SocialAccounts accounts={MOCK_SOCIAL_ACCOUNTS} />
      </>
    );
  }

  if (slug === 'privacy') {
    return (
      <>
        <h1 className="hidden pb-3 text-xl font-bold md:mx-auto md:block md:max-w-3xl">
          {t('privacy.title')}
        </h1>
        <Separator className="mb-6 hidden md:mx-auto md:block md:max-w-3xl" />
        <PrivacySettings settings={MOCK_PRIVACY_SETTINGS} />
      </>
    );
  }

  return null;
}
