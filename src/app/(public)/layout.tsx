import type React from 'react';
import { PublicHeader } from '@/components/public-header';

export default async function PublicLayout({ children }: React.PropsWithChildren) {
  // TODO: add authentication redirect once session is implemented
  // const session = await getSession();
  // if (session) redirect('/');

  return (
    <>
      <PublicHeader />
      <main>{children}</main>
    </>
  );
}
