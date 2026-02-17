import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  getAlternateLanguages,
  getLocalePath,
  getOgLocale,
} from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';
import { ACHIEVEMENTS } from '../../_lib/achievement';
import { Profile } from './_components/profile';
import {
  MOCK_FRIEND_SUGGESTIONS,
  MOCK_STATISTICS,
  MOCK_USER_PROFILE,
} from './_lib/mock-data';

type GenerateMetadataProps = {
  params: Promise<{ locale: string; username: string }>;
};

type ProfilePageProps = GenerateMetadataProps;

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { locale, username } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'profile_page.metadata',
  });

  const path = `/profile/${username}`;

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: getLocalePath(path, locale as Locale),
      languages: getAlternateLanguages(path),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: getOgLocale(locale as Locale),
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'profile_page' });

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Profile
        user={MOCK_USER_PROFILE}
        stats={MOCK_STATISTICS}
        friendSuggestions={MOCK_FRIEND_SUGGESTIONS}
        achievements={ACHIEVEMENTS}
      />
    </>
  );
}
