'use client';

import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import {
  getArticulationAreasOpt,
  getArticulationPointsOpt,
} from '@/queries/articulation';
import {
  getLetterArticulationsOpt,
  getLettersOpt,
  getLetterTraitsOpt,
} from '@/queries/letter';
import { getTraitGroupsOpt, getTraitsOpt } from '@/queries/trait';
import {
  createPlaygroundStore,
  type PlaygroundStore,
} from '../stores/playground';

type PlaygroundStoreApi = ReturnType<typeof createPlaygroundStore>;

const PlaygroundStoreContext = createContext<PlaygroundStoreApi | undefined>(
  undefined,
);

export function PlaygroundStoreProvider({ children }: React.PropsWithChildren) {
  const storeRef = useRef<PlaygroundStoreApi>(undefined);
  storeRef.current ??= createPlaygroundStore();

  const store = storeRef.current;

  const { data: letters } = useQuery(getLettersOpt());
  const { data: letterArticulations } = useQuery(getLetterArticulationsOpt());
  const { data: letterTraits } = useQuery(getLetterTraitsOpt());
  const { data: articulationAreas } = useQuery(getArticulationAreasOpt());
  const { data: articulationPoints } = useQuery(getArticulationPointsOpt());
  const { data: traits } = useQuery(getTraitsOpt());
  const { data: traitGroups } = useQuery(getTraitGroupsOpt());

  console.log('letters', letters);
  console.log('letterArticulations', letterArticulations);
  console.log('letterTraits', letterTraits);
  console.log('articulationAreas', articulationAreas);
  console.log('articulationPoints', articulationPoints);
  console.log('traits', traits);
  console.log('traitGroups', traitGroups);

  return (
    <PlaygroundStoreContext.Provider value={store}>
      {children}
    </PlaygroundStoreContext.Provider>
  );
}

export function usePlaygroundStore<T>(
  selector: (store: PlaygroundStore) => T,
): T {
  const usePlaygroundStoreContext = useContext(PlaygroundStoreContext);

  if (!usePlaygroundStoreContext) {
    throw new Error(
      `usePlaygroundStore must be used within PlaygroundStoreProvider`,
    );
  }

  return useStore(usePlaygroundStoreContext, selector);
}
