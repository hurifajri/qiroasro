import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getPersistedGlobalStore } from '@/stores/global';
import {
  MOCK_DAILY_REMINDER,
  MOCK_GENERAL_NOTIFICATIONS,
  MOCK_LESSON_PREFERENCES,
  MOCK_PRIVACY_SETTINGS,
  MOCK_PROFILE_DATA,
  MOCK_SOCIAL_ACCOUNTS,
} from '../_lib/mock-data';
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

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale, slug } = await params;

  // Validate slug
  if (!VALID_SLUGS.includes(slug as SettingsSlug)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'settings_page' });

  // Conditional rendering based on slug
  if (slug === 'preferences') {
    const persistedState = await getPersistedGlobalStore();
    const { theme } = persistedState;

    return (
      <>
        <h1 className="mb-6 hidden font-bold text-2xl md:block">
          {t('preferences.title')}
        </h1>
        <Preferences
          lessonPreferences={MOCK_LESSON_PREFERENCES}
          theme={theme}
        />
      </>
    );
  }

  if (slug === 'profile') {
    return (
      <>
        <h1 className="mb-6 hidden font-bold text-2xl md:block">
          {t('profile.title')}
        </h1>
        <Profile defaultProfile={MOCK_PROFILE_DATA} />
      </>
    );
  }

  if (slug === 'notifications') {
    return (
      <>
        <h1 className="mb-6 hidden font-bold text-2xl md:block">
          {t('notifications.title')}
        </h1>
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
        <h1 className="mb-6 hidden font-bold text-2xl md:block">
          {t('social.title')}
        </h1>
        <SocialAccounts accounts={MOCK_SOCIAL_ACCOUNTS} />
      </>
    );
  }

  if (slug === 'privacy') {
    return (
      <>
        <h1 className="mb-6 hidden font-bold text-2xl md:block">
          {t('privacy.title')}
        </h1>
        <PrivacySettings settings={MOCK_PRIVACY_SETTINGS} />
      </>
    );
  }

  // Placeholder for other settings pages
  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        <p>Settings for: {slug}</p>
        <p className="mt-2 text-sm">This page is not yet implemented.</p>
      </div>
    </>
  );
}
