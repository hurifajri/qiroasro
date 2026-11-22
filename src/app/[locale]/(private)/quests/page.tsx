import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import {
  getCurrentUserDailyQuests,
  getCurrentUserMonthlyQuest,
} from '../_services/gamification';
import { Quests } from './_components/quests';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'quests_page.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  };
}

export default async function QuestsPage({ params }: Readonly<PageProps>) {
  const { locale } = await params;
  const [t, monthlyQuest, dailyQuests] = await Promise.all([
    getTranslations({ locale, namespace: 'quests_page' }),
    getCurrentUserMonthlyQuest(),
    getCurrentUserDailyQuests(),
  ]);

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Quests monthlyQuest={monthlyQuest} dailyQuests={dailyQuests} />
    </>
  );
}
