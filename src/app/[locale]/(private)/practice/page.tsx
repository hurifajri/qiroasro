import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  getAlternateLanguages,
  getLocalePath,
  getOgLocale,
} from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';
import { Practice } from './_components/practice';
import { PRACTICE_SECTIONS } from './_lib/mock-data';

type GenerateMetadataProps = {
  params: Promise<{ locale: string }>;
};

type PracticePageProps = GenerateMetadataProps;

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'practice_page.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: getLocalePath('/practice', locale as Locale),
      languages: getAlternateLanguages('/practice'),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: getOgLocale(locale as Locale),
    },
  };
}

export default async function PracticePage({ params }: PracticePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'practice_page' });

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Practice sections={PRACTICE_SECTIONS} />
    </>
  );
}
