'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getLetterArticulationsOpt,
  getLettersOpt,
  getLetterTraitsOpt,
} from '@/queries/letter';

export function HomeContainer({ children }: React.PropsWithChildren) {
  const { data: letters } = useQuery(getLettersOpt());
  const { data: letterArticulations } = useQuery(getLetterArticulationsOpt());
  const { data: letterTraits } = useQuery(getLetterTraitsOpt());

  console.log('letters', letters);
  console.log('letterArticulations', letterArticulations);
  console.log('letterTraits', letterTraits);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      {children}
    </div>
  );
}
