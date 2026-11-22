import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LEAGUES } from '../_lib/league';
import { getCurrentUserStats } from '../_services/gamification';
import { Leaderboard } from './_components/leaderboard';
import { MOCK_FULL_LEADERBOARD } from './_lib/mock-data';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'leaderboard_page.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  };
}

export default async function LeaderboardPage({ params }: Readonly<PageProps>) {
  const { locale } = await params;
  const [t, stats] = await Promise.all([
    getTranslations({ locale, namespace: 'leaderboard_page' }),
    getCurrentUserStats(),
  ]);

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Leaderboard
        leagues={LEAGUES}
        currentLeagueNameKey={stats.leagueNameKey}
        entries={MOCK_FULL_LEADERBOARD}
      />
    </>
  );
}
