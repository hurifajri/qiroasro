import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { setRequestLocale } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { getUserProfileByUserIdOpt } from '@/queries/user-profile';
import { Private } from './_components/private';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type PrivateLayoutProps = React.PropsWithChildren & {
  params: Promise<{ locale: string }>;
  header: React.ReactNode;
  sidebar: React.ReactNode;
};

export default async function PrivateLayout({
  children,
  params,
  header,
  sidebar,
}: PrivateLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

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
