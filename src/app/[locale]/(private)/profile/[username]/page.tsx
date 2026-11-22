import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getUserProfileByUsernameOpt } from '../../_queries/user-profile';
import {
  getUserAchievementsById,
  getUserProfileStatistics,
} from '../../_services/gamification';
import { getFriendSuggestions } from '../../_services/social';
import { Profile } from './_components/profile';

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

export default async function ProfilePage({ params }: Readonly<PageProps>) {
  const { locale, username } = await params;
  const t = await getTranslations({ locale, namespace: 'profile_page' });

  const queryClient = new QueryClient();

  // Check if the profile exists before rendering
  const userProfile = await queryClient.fetchQuery(
    getUserProfileByUsernameOpt(username),
  );

  // If user doesn't exist, instantly show 404 page
  if (!userProfile) notFound();

  // Prefetch user profile so Profile component gets it instantly via useSuspenseQuery
  const [, stats, achievements, friendSuggestions] = await Promise.all([
    queryClient.prefetchQuery(getUserProfileByUsernameOpt(username)),
    getUserProfileStatistics(userProfile.id, locale),
    getUserAchievementsById(userProfile.id),
    getFriendSuggestions(userProfile.id),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h1 className="sr-only">{t('title')}</h1>
      <Profile
        username={username}
        stats={stats}
        friendSuggestions={friendSuggestions}
        achievements={achievements}
      />
    </HydrationBoundary>
  );
}
