import type React from 'react';
import { PublicHeader } from '@/components/common/public-header';
import { getPersistedGlobalStore } from '@/stores/global';

export default async function PublicLayout({
  children,
}: React.PropsWithChildren) {
  const persistedState = await getPersistedGlobalStore();
  const { theme } = persistedState;

  return (
    <>
      <PublicHeader theme={theme} />
      <main>{children}</main>
    </>
  );
}
