'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { createPlaygroundStore, type PlaygroundStore } from '../stores/playground';

type PlaygroundStoreApi = ReturnType<typeof createPlaygroundStore>;

const PlaygroundStoreContext = createContext<PlaygroundStoreApi | undefined>(undefined);

export function PlaygroundStoreProvider({ children }: React.PropsWithChildren) {
  const storeRef = useRef<PlaygroundStoreApi>(undefined);
  storeRef.current ??= createPlaygroundStore();

  const store = storeRef.current;

  return (
    <PlaygroundStoreContext.Provider value={store}>{children}</PlaygroundStoreContext.Provider>
  );
}

export function usePlaygroundStore<T>(selector: (store: PlaygroundStore) => T): T {
  const usePlaygroundStoreContext = useContext(PlaygroundStoreContext);

  if (!usePlaygroundStoreContext) {
    throw new Error(`usePlaygroundStore must be used within PlaygroundStoreProvider`);
  }

  return useStore(usePlaygroundStoreContext, selector);
}
