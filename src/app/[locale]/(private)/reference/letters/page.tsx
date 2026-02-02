import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  getAlternateLanguages,
  getLocalePath,
  getOgLocale,
} from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';
import { Letters } from './_components/letters';
import { getLettersStats, MAKHRAJ_GROUPS } from './_lib/mock-data';

type GenerateMetadataProps = {
  params: Promise<{ locale: string }>;
};

type LettersPageProps = GenerateMetadataProps;

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'reference_letters_page.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: getLocalePath('/reference/letters', locale as Locale),
      languages: getAlternateLanguages('/reference/letters'),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: getOgLocale(locale as Locale),
    },
  };
}

export default async function LettersPage({ params }: LettersPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: 'reference_letters_page',
  });

  const stats = getLettersStats();

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Letters
        groups={MAKHRAJ_GROUPS}
        learnedCount={stats.learned}
        totalCount={stats.total}
      />
    </>
  );
}
