import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Reference } from './_components/reference';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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

export default async function ReferencePage({ params }: Readonly<PageProps>) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'reference_page' });

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Reference />
    </>
  );
}
