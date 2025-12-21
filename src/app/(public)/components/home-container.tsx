'use client';

import { useQuery } from '@tanstack/react-query';
import { getLetterArticulationsOpt, getLettersOpt } from '@/queries/letter';

export function HomeContainer({ children }: React.PropsWithChildren) {
  const { data: letters } = useQuery(getLettersOpt());
  const { data: letterArticulations } = useQuery(getLetterArticulationsOpt());

  console.log('letters', letters);
  console.log('letterArticulations', letterArticulations);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      {children}
    </div>
  );
}
