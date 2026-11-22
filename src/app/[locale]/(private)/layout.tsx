import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';

import { Private } from './_components/private';
import { getUserProfileByUserIdOpt } from './_queries/user-profile';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type PrivateLayoutProps = Readonly<
  React.PropsWithChildren<{
    header: React.ReactNode;
    sidebar: React.ReactNode;
  }>
>;

export default async function PrivateLayout({
  children,
  header,
  sidebar,
}: PrivateLayoutProps) {
  // Get session to know who is logged in
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id ?? '';

  // Prefetch user profile so client components get it instantly via useSuspenseQuery
  const queryClient = new QueryClient();
  if (userId) {
    await queryClient.prefetchQuery(getUserProfileByUserIdOpt(userId));
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Private userId={userId} header={header} sidebar={sidebar}>
        {children}
      </Private>
    </HydrationBoundary>
  );
}
