import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { ReactFlowProvider } from '@xyflow/react';
import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { Playground } from './components/playground';
import { PlaygroundStoreProvider } from './providers/playground';
import { QuizStoreProvider } from './providers/quiz';
import { getPlaygroundDataOpt } from './queries/playground';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('playground_page.metadata');
  const locale = await getLocale();

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: '/playground',
      languages: { id: '/playground', en: '/playground' },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: locale === 'id' ? 'id_ID' : 'en_US',
    },
  };
}

export default async function PlaygroundPage() {
  const t = await getTranslations('playground_page');

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
