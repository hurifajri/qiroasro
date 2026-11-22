import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LEAGUES } from '@/features/gamification/lib/league';
import { getCurrentUserStats } from '@/features/gamification/services/gamification';

import { getWeeklyLeaderboard } from '../_services/social';
import { Leaderboard } from './_components/leaderboard';

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
  const [t, stats, entries] = await Promise.all([
    getTranslations({ locale, namespace: 'leaderboard_page' }),
    getCurrentUserStats(),
    getWeeklyLeaderboard(),
  ]);

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Leaderboard
        leagues={LEAGUES}
        currentLeagueNameKey={stats.leagueNameKey}
        entries={entries}
      />
    </>
  );
}
