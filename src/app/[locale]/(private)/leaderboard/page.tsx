import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LEAGUES } from '../_lib/league';
import { MOCK_USER_STATS } from '../_lib/mock-data';
import { Leaderboard } from './_components/leaderboard';
import { MOCK_FULL_LEADERBOARD } from './_lib/mock-data';

type GenerateMetadataProps = {
  params: Promise<{ locale: string }>;
};

type LeaderboardPageProps = GenerateMetadataProps;

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
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

export default async function LeaderboardPage({
  params,
}: LeaderboardPageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'leaderboard_page' });

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Leaderboard
        leagues={LEAGUES}
        currentLeagueNameKey={MOCK_USER_STATS.leagueNameKey}
        entries={MOCK_FULL_LEADERBOARD}
      />
    </>
  );
}
