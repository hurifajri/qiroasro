import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Sections } from './_components/sections';

type GenerateMetadataProps = {
  params: Promise<{ locale: string }>;
};

type SectionsPageProps = GenerateMetadataProps;

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'sections_page.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  };
}

export default async function SectionsPage({ params }: SectionsPageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'sections_page' });

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Sections />
    </>
  );
}
