'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { createQuizStore, type QuizStore } from '../_stores/quiz';

type QuizStoreApi = ReturnType<typeof createQuizStore>;

const QuizStoreContext = createContext<QuizStoreApi | undefined>(undefined);

export function QuizStoreProvider({ children }: React.PropsWithChildren) {
  const storeRef = useRef<QuizStoreApi>(undefined);
  storeRef.current ??= createQuizStore();

  const store = storeRef.current;

  return (
    <QuizStoreContext.Provider value={store}>
      {children}
    </QuizStoreContext.Provider>
  );
}

export function useQuizStore<T>(selector: (store: QuizStore) => T): T {
  const quizStoreContext = useContext(QuizStoreContext);

  if (!quizStoreContext) {
    throw new Error(`useQuizStore must be used within QuizStoreProvider`);
  }

  return useStore(quizStoreContext, selector);
}
