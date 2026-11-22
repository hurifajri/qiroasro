import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Learn } from './_components/learn';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'learn_page.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  };
}

export default async function LearnPage({ params }: Readonly<PageProps>) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'learn_page' });

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Learn />
    </>
  );
}
