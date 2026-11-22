import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { ReactFlowProvider } from '@xyflow/react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { getPlaygroundDataOpt } from '@/features/tajweed-graph/queries/tajweed-graph';
import {
  getAlternateLanguages,
  getLocalePath,
  getOgLocale,
} from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';

import { Playground } from './_components/playground';
import { PlaygroundStoreProvider } from './_providers/playground';
import { QuizStoreProvider } from './_providers/quiz';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'playground_page.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: getLocalePath('/playground', locale as Locale),
      languages: getAlternateLanguages('/playground'),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: getOgLocale(locale as Locale),
    },
  };
}

export default async function PlaygroundPage({ params }: Readonly<PageProps>) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'playground_page' });

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getPlaygroundDataOpt());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h1 className="sr-only">{t('title')}</h1>
      <PlaygroundStoreProvider>
        <QuizStoreProvider>
          <ReactFlowProvider>
            <Playground />
          </ReactFlowProvider>
        </QuizStoreProvider>
      </PlaygroundStoreProvider>
    </HydrationBoundary>
  );
}
