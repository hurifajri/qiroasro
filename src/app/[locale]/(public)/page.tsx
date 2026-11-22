import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { getPlaygroundDataOpt } from '@/features/tajweed-graph/queries/tajweed-graph';
import {
  getAlternateLanguages,
  getLocalePath,
  getOgLocale,
} from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';

import { Home } from './_components/home';

type PageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home_page.metadata' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: getLocalePath('/', locale as Locale),
      languages: getAlternateLanguages('/'),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: getOgLocale(locale as Locale),
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'home_page' });

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getPlaygroundDataOpt());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h1 className="sr-only">{t('title')}</h1>
      <Home />
    </HydrationBoundary>
  );
}
