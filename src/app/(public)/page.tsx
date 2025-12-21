import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getTranslations } from 'next-intl/server';
import {
  getArticulationAreasOpt,
  getArticulationPointsOpt,
} from '@/queries/articulation';
import {
  getLetterArticulationsOpt,
  getLettersOpt,
  getLetterTraitsOpt,
} from '@/queries/letter';
import { getTraitGroupsOpt, getTraitsOpt } from '@/queries/trait';
import { HomeContainer } from './components/home-container';

export default async function Home() {
  const t = await getTranslations('global');

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getLettersOpt());
  await queryClient.prefetchQuery(getLetterArticulationsOpt());
  await queryClient.prefetchQuery(getLetterTraitsOpt());
  await queryClient.prefetchQuery(getArticulationAreasOpt());
  await queryClient.prefetchQuery(getArticulationPointsOpt());
  await queryClient.prefetchQuery(getTraitsOpt());
  await queryClient.prefetchQuery(getTraitGroupsOpt());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeContainer>
        <h1 className="font-bold text-2xl text-foreground">{t('greeting')}</h1>
      </HomeContainer>
    </HydrationBoundary>
  );
}
