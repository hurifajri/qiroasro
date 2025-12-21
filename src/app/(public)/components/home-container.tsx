'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getArticulationAreasOpt,
  getArticulationPointsOpt,
} from '@/queries/articulation';
import {
  getLetterArticulationsOpt,
  getLettersOpt,
  getLetterTraitsOpt,
} from '@/queries/letter';
import { getTraitsOpt } from '@/queries/trait';

export function HomeContainer({ children }: React.PropsWithChildren) {
  const { data: letters } = useQuery(getLettersOpt());
  const { data: letterArticulations } = useQuery(getLetterArticulationsOpt());
  const { data: letterTraits } = useQuery(getLetterTraitsOpt());
  const { data: articulationAreas } = useQuery(getArticulationAreasOpt());
  const { data: articulationPoints } = useQuery(getArticulationPointsOpt());
  const { data: traits } = useQuery(getTraitsOpt());

  console.log('letters', letters);
  console.log('letterArticulations', letterArticulations);
  console.log('letterTraits', letterTraits);
  console.log('articulationAreas', articulationAreas);
  console.log('articulationPoints', articulationPoints);
  console.log('traits', traits);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      {children}
    </div>
  );
}
