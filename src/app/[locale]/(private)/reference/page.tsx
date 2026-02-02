import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  getAlternateLanguages,
  getLocalePath,
  getOgLocale,
} from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';
import { Reference } from './_components/reference';
import { REFERENCE_CATEGORIES } from './_lib/mock-data';

type GenerateMetadataProps = {
  params: Promise<{ locale: string }>;
};

type ReferencePageProps = GenerateMetadataProps;

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'reference_page.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: getLocalePath('/reference', locale as Locale),
      languages: getAlternateLanguages('/reference'),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: getOgLocale(locale as Locale),
    },
  };
}

export default async function ReferencePage({ params }: ReferencePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'reference_page' });

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Reference categories={REFERENCE_CATEGORIES} />
    </>
  );
}
