import type React from 'react';
import { PublicHeader } from '@/components/common/public-header';

export default function PublicLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <PublicHeader />
      <main>{children}</main>
    </>
  );
}
