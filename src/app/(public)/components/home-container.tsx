'use client';

import { useQuery } from '@tanstack/react-query';
import { getArticulationAreasOpt } from '@/queries/articulation';
import {
  getLetterArticulationsOpt,
  getLettersOpt,
  getLetterTraitsOpt,
} from '@/queries/letter';

export function HomeContainer({ children }: React.PropsWithChildren) {
  const { data: letters } = useQuery(getLettersOpt());
  const { data: letterArticulations } = useQuery(getLetterArticulationsOpt());
  const { data: letterTraits } = useQuery(getLetterTraitsOpt());
  const { data: articulationAreas } = useQuery(getArticulationAreasOpt());

  console.log('letters', letters);
  console.log('letterArticulations', letterArticulations);
  console.log('letterTraits', letterTraits);
  console.log('articulationAreas', articulationAreas);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      {children}
    </div>
  );
}
