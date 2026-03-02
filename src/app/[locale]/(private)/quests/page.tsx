import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MOCK_QUESTS } from '../_lib/mock-data';
import { Quests } from './_components/quests';
import { MOCK_MONTHLY_QUEST } from './_lib/mock-data';

type GenerateMetadataProps = {
  params: Promise<{ locale: string }>;
};

type QuestsPageProps = GenerateMetadataProps;

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
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

export default async function QuestsPage({ params }: QuestsPageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'quests_page' });

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Quests monthlyQuest={MOCK_MONTHLY_QUEST} dailyQuests={MOCK_QUESTS} />
    </>
  );
}
