import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  MOCK_APPEARANCE_MODE,
  MOCK_LESSON_PREFERENCES,
  MOCK_PROFILE_DATA,
} from '../_lib/mock-data';
import { Preferences } from './_components/preferences';
import { Profile } from './_components/profile';

interface SettingsPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Valid settings slugs
const VALID_SLUGS = [
  'account',
  'preferences',
  'profile',
  'notifications',
  'courses',
  'privacy',
] as const;

type SettingsSlug = (typeof VALID_SLUGS)[number];

export async function generateMetadata({
  params,
}: SettingsPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  // Validate slug
  if (!VALID_SLUGS.includes(slug as SettingsSlug)) {
    return {
      title: 'Settings',
      description: 'Manage your settings',
    };
  }

  const t = await getTranslations({
    locale,
    namespace: 'settings_page.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
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
    return (
      <>
        <h1 className="mb-6 font-bold text-2xl">{t('preferences.title')}</h1>
        <Preferences
          lessonPreferences={MOCK_LESSON_PREFERENCES}
          defaultAppearanceMode={MOCK_APPEARANCE_MODE}
        />
      </>
    );
  }

  if (slug === 'profile') {
    return (
      <>
        <h1 className="mb-6 font-bold text-2xl">{t('profile.title')}</h1>
        <Profile defaultProfile={MOCK_PROFILE_DATA} />
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
