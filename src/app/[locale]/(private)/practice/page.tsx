import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Practice } from './_components/practice';
import { PRACTICE_SECTIONS } from './_lib/mock-data';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'practice_page.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  };
}

export default async function PracticePage({ params }: Readonly<PageProps>) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'practice_page' });

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Practice sections={PRACTICE_SECTIONS} />
    </>
  );
}
