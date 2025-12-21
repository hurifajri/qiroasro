'use client';

import { useQuery } from '@tanstack/react-query';
import { getLettersOpt } from '@/queries/letter';

export function HomeContainer({ children }: React.PropsWithChildren) {
  const { data: letters, error } = useQuery(getLettersOpt());

  console.log('letters', letters);
  console.log('error', error);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      {children}
    </div>
  );
}
