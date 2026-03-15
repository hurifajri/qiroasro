import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Reference } from './_components/reference';
import { REFERENCE_CATEGORIES } from './_lib/reference';

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
    robots: { index: false, follow: false },
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
