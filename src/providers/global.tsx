'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import {
  createGlobalStore,
  type GlobalState,
  type GlobalStore,
  initGlobalState,
} from '@/stores/global';

type GlobalStoreApi = ReturnType<typeof createGlobalStore>;

const GlobalStoreContext = createContext<GlobalStoreApi | undefined>(undefined);

type GlobalStoreProviderProps = React.PropsWithChildren & Readonly<{ initialState?: GlobalState }>;

export function GlobalStoreProvider({ children, initialState }: GlobalStoreProviderProps) {
  const storeRef = useRef<GlobalStoreApi>(undefined);
  const globalState = initialState ?? initGlobalState();
  storeRef.current ??= createGlobalStore(globalState);

  const store = storeRef.current;

  useEffect(() => {
    void store.persist.rehydrate();
  }, [store.persist.rehydrate]);

  return <GlobalStoreContext.Provider value={store}>{children}</GlobalStoreContext.Provider>;
}

export function useGlobalStore<T>(selector: (store: GlobalStore) => T): T {
  const globalStoreContext = useContext(GlobalStoreContext);

  if (!globalStoreContext) {
    throw new Error(`useGlobalStore must be used within GlobalStoreProvider`);
  }

  return useStore(globalStoreContext, selector);
}
