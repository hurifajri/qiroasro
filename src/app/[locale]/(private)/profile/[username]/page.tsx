import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getUserProfileByUsername } from '@/services/user-profile';
import { ACHIEVEMENTS } from '../../_lib/achievement';
import { Profile } from './_components/profile';
import {
  MOCK_FRIEND_SUGGESTIONS,
  MOCK_STATISTICS,
  MOCK_USER_PROFILE,
} from './_lib/mock-data';
import type { UserProfile as UIUserProfile } from './_schemas/profile';

type GenerateMetadataProps = {
  params: Promise<{ locale: string; username: string }>;
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
  const { locale, username } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const dbUserProfile = await getUserProfileByUsername(username);

  // If user doesn't exist, instantly show 404 page
  if (!dbUserProfile) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'profile_page' });

  // Map DB user profile to the UI component's expected format.
  // We keep some mock fields (counts, joinedDate) for now until they are built in DB.
  const userProps: UIUserProfile = {
    ...MOCK_USER_PROFILE,
    username: dbUserProfile.username,
    displayName: dbUserProfile.displayName,
    avatarColorCode:
      dbUserProfile.avatarColorCode as UIUserProfile['avatarColorCode'],
    joinedDate: dbUserProfile.createdAt ?? MOCK_USER_PROFILE.joinedDate,
  };

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Profile
        user={userProps}
        stats={MOCK_STATISTICS}
        friendSuggestions={MOCK_FRIEND_SUGGESTIONS}
        achievements={ACHIEVEMENTS}
      />
    </>
  );
}
