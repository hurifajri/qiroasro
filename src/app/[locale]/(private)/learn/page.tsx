import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  getAlternateLanguages,
  getLocalePath,
  getOgLocale,
} from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';
import { Learn } from './_components/learn';

type GenerateMetadataProps = {
  params: Promise<{ locale: string }>;
};

type LearnPageProps = GenerateMetadataProps;

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'learn_page.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: getLocalePath('/learn', locale as Locale),
      languages: getAlternateLanguages('/learn'),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: getOgLocale(locale as Locale),
    },
  };
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'learn_page' });

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Learn />
    </>
  );
}
