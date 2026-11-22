'use client';

import { createContext, type PropsWithChildren, use, useState } from 'react';
import { useStore } from 'zustand';

import { createQuizStore, type QuizStore } from '../stores/quiz';

type QuizStoreApi = ReturnType<typeof createQuizStore>;

const QuizStoreContext = createContext<QuizStoreApi | undefined>(undefined);

export function QuizStoreProvider({ children }: Readonly<PropsWithChildren>) {
  const [store] = useState(() => createQuizStore());

  return <QuizStoreContext value={store}>{children}</QuizStoreContext>;
}

export function useQuizStore<T>(selector: (store: QuizStore) => T): T {
  const quizStoreContext = use(QuizStoreContext);

  if (!quizStoreContext) {
    throw new Error('useQuizStore must be used within QuizStoreProvider');
  }

  return useStore(quizStoreContext, selector);
}
