import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getSectionsWithProgressOpt } from '../_queries/curriculum-progress';
import { Sections } from './_components/sections';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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

export default async function SectionsPage({ params }: PageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'sections_page' });

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getSectionsWithProgressOpt());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h1 className="sr-only">{t('title')}</h1>
      <Sections />
    </HydrationBoundary>
  );
}
