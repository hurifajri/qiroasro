'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import {
  createGlobalStore,
  type GlobalStore,
  initGlobalState,
} from '@/stores/global';

type GlobalStoreApi = ReturnType<typeof createGlobalStore>;

const GlobalStoreContext = createContext<GlobalStoreApi | undefined>(undefined);

export function GlobalStoreProvider({ children }: React.PropsWithChildren) {
  const storeRef = useRef<GlobalStoreApi>(undefined);
  const globalState = initGlobalState();
  storeRef.current ??= createGlobalStore(globalState);

  const store = storeRef.current;

  return (
    <GlobalStoreContext.Provider value={store}>
      {children}
    </GlobalStoreContext.Provider>
  );
}

export function useGlobalStore<T>(selector: (store: GlobalStore) => T): T {
  const globalStoreContext = useContext(GlobalStoreContext);

  if (!globalStoreContext) {
    throw new Error(`useGlobalStore must be used within GlobalStoreProvider`);
  }

  return useStore(globalStoreContext, selector);
}
