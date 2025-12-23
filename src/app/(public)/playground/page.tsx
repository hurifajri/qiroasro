import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { ReactFlowProvider } from '@xyflow/react';
import { getTranslations } from 'next-intl/server';
import { getArticulationAreasOpt, getArticulationPointsOpt } from '@/queries/articulation';
import { getLetterArticulationsOpt, getLettersOpt, getLetterTraitsOpt } from '@/queries/letter';
import { getTraitGroupsOpt, getTraitsOpt } from '@/queries/trait';
import { Playground } from './components/playground';
import { PlaygroundStoreProvider } from './providers/playground';

export default async function PlaygroundPage() {
  const t = await getTranslations('PlaygroundPage');

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(getLettersOpt()),
    queryClient.prefetchQuery(getLetterArticulationsOpt()),
    queryClient.prefetchQuery(getLetterTraitsOpt()),
    queryClient.prefetchQuery(getArticulationAreasOpt()),
    queryClient.prefetchQuery(getArticulationPointsOpt()),
    queryClient.prefetchQuery(getTraitsOpt()),
    queryClient.prefetchQuery(getTraitGroupsOpt()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h1 className="sr-only">{t('title')}</h1>
      <PlaygroundStoreProvider>
        <ReactFlowProvider>
          <Playground />
        </ReactFlowProvider>
      </PlaygroundStoreProvider>
    </HydrationBoundary>
  );
}
