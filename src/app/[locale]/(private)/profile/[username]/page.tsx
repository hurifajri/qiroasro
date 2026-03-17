import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ACHIEVEMENTS } from '../../_lib/achievement';
import { getUserProfileByUsernameOpt } from '../../_queries/user-profile';
import { Profile } from './_components/profile';
import { MOCK_FRIEND_SUGGESTIONS, MOCK_STATISTICS } from './_lib/mock-data';

type PageProps = {
  params: Promise<{ locale: string; username: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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

export default async function ProfilePage({ params }: PageProps) {
  const { locale, username } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'profile_page' });

  const queryClient = new QueryClient();

  // Check if the profile exists before rendering
  const userProfile = await queryClient.fetchQuery(
    getUserProfileByUsernameOpt(username),
  );

  // If user doesn't exist, instantly show 404 page
  if (!userProfile) notFound();

  // Prefetch user profile so Profile component gets it instantly via useSuspenseQuery
  await queryClient.prefetchQuery(getUserProfileByUsernameOpt(username));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h1 className="sr-only">{t('title')}</h1>
      <Profile
        username={username}
        stats={MOCK_STATISTICS}
        friendSuggestions={MOCK_FRIEND_SUGGESTIONS}
        achievements={ACHIEVEMENTS}
      />
    </HydrationBoundary>
  );
}
