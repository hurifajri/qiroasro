'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import {
  createQuizStore,
  initQuizState,
  type PersistedQuizState,
  type QuizStore,
} from '../stores/quiz';

type QuizStoreApi = ReturnType<typeof createQuizStore>;

const QuizStoreContext = createContext<QuizStoreApi | undefined>(undefined);

type QuizStoreProviderProps = React.PropsWithChildren &
  Readonly<{ persistedState?: PersistedQuizState }>;

export function QuizStoreProvider({ children, persistedState }: QuizStoreProviderProps) {
  const storeRef = useRef<QuizStoreApi>(undefined);
  const quizState = initQuizState(persistedState);
  storeRef.current ??= createQuizStore(quizState);

  const store = storeRef.current;

  // Rehydrate persisted state from cookies
  useEffect(() => {
    void store.persist.rehydrate();
  }, [store.persist.rehydrate]);

  return <QuizStoreContext.Provider value={store}>{children}</QuizStoreContext.Provider>;
}

export function useQuizStore<T>(selector: (store: QuizStore) => T): T {
  const quizStoreContext = useContext(QuizStoreContext);

  if (!quizStoreContext) {
    throw new Error(`useQuizStore must be used within QuizStoreProvider`);
  }

  return useStore(quizStoreContext, selector);
}
