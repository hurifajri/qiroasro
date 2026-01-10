import type React from 'react';
import { PublicHeader } from '@/components/common/public-header';
import { getPersistedGlobalStore } from '@/stores/global';

export default async function PublicLayout({
  children,
}: React.PropsWithChildren) {
  const persistedState = await getPersistedGlobalStore();
  const { locale, theme } = persistedState;

  // TODO: add authentication redirect once session is implemented
  // const session = await getSession();
  // if (session) redirect('/');

  return (
    <>
      <PublicHeader locale={locale} theme={theme} />
      <main>{children}</main>
    </>
  );
}
