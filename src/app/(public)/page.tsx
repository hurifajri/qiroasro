import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getTranslations } from 'next-intl/server';
import { getLetterArticulationsOpt, getLettersOpt } from '@/queries/letter';
import { HomeContainer } from './components/home-container';

export default async function Home() {
  const t = await getTranslations('global');

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getLettersOpt());
  await queryClient.prefetchQuery(getLetterArticulationsOpt());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeContainer>
        <h1 className="font-bold text-2xl text-foreground">{t('greeting')}</h1>
      </HomeContainer>
    </HydrationBoundary>
  );
}
