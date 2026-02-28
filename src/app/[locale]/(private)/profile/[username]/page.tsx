import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ACHIEVEMENTS } from '../../_lib/achievement';
import { Profile } from './_components/profile';
import {
  MOCK_FRIEND_SUGGESTIONS,
  MOCK_STATISTICS,
  MOCK_USER_PROFILE,
} from './_lib/mock-data';

type GenerateMetadataProps = {
  params: Promise<{ locale: string }>;
};

type ProfilePageProps = GenerateMetadataProps;

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'profile_page.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
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
