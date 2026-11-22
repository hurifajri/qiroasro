import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { getLettersDirectoryData } from '../../_services/reference';
import { Letters } from './_components/letters';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'reference_letters_page.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  };
}

export default async function LettersPage({ params }: Readonly<PageProps>) {
  const { locale } = await params;

  const [t, directory] = await Promise.all([
    getTranslations({
      locale,
      namespace: 'reference_letters_page',
    }),
    getLettersDirectoryData(),
  ]);

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Letters
        groups={directory.groups}
        learnedCount={directory.learned}
        totalCount={directory.total}
      />
    </>
  );
}
