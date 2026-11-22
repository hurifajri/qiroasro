'use client';

import { createContext, type PropsWithChildren, use, useState } from 'react';
import { useStore } from 'zustand';

import {
  createPlaygroundStore,
  type PlaygroundStore,
} from '../stores/playground';

type PlaygroundStoreApi = ReturnType<typeof createPlaygroundStore>;

const PlaygroundStoreContext = createContext<PlaygroundStoreApi | undefined>(
  undefined,
);

export function PlaygroundStoreProvider({
  children,
}: Readonly<PropsWithChildren>) {
  const [store] = useState(() => createPlaygroundStore());

  return (
    <PlaygroundStoreContext value={store}>{children}</PlaygroundStoreContext>
  );
}

export function usePlaygroundStore<T>(
  selector: (store: PlaygroundStore) => T,
): T {
  const playgroundStoreContext = use(PlaygroundStoreContext);

  if (!playgroundStoreContext) {
    throw new Error(
      'usePlaygroundStore must be used within PlaygroundStoreProvider',
    );
  }

  return useStore(playgroundStoreContext, selector);
}
