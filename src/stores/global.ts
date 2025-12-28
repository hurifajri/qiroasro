import type { ColorMode } from '@xyflow/react';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import { GLOBAL_STORE_KEY } from '@/lib/constants';
import { getCookies } from '@/lib/cookies';
import { cookiesStorage } from '@/lib/storage';

export type Locale = 'en' | 'id';
export type WaitlistStatus = 'idle' | 'success' | 'verified' | 'already_verified' | 'error';

export interface GlobalState {
  locale: Locale;
  theme: ColorMode;
  waitlistStatus: WaitlistStatus;
}

export type PersistedGlobalState = Pick<GlobalState, 'locale' | 'theme'>;

interface PersistedGlobal {
  state: PersistedGlobalState;
  version: number;
}

interface GlobalAction {
  setLocale: (locale: Locale) => void;
  setTheme: (theme: ColorMode) => void;
  setWaitlistStatus: (status: WaitlistStatus) => void;
}

export type GlobalStore = GlobalState & GlobalAction;

function initPersistedGlobalState(): PersistedGlobalState {
  return { locale: 'id', theme: 'light' };
}

export function initGlobalState(persistedState?: PersistedGlobalState): GlobalState {
  const initPersistedState = persistedState ?? initPersistedGlobalState();

  return { ...initPersistedState, waitlistStatus: 'idle' };
}

export function createGlobalStore(globalState: GlobalState) {
  return createStore<GlobalStore>()(
    persist(
      (set) => ({
        ...globalState,
        setLocale: (locale) => set(() => ({ locale })),
        setTheme: (theme) => set(() => ({ theme })),
        setWaitlistStatus: (status) => set(() => ({ waitlistStatus: status })),
      }),
      {
        name: GLOBAL_STORE_KEY,
        storage: createJSONStorage(() => cookiesStorage),
        skipHydration: true,
        partialize: (state) => ({
          locale: state.locale,
          theme: state.theme,
        }),
      },
    ),
  );
}

// Get persisted global store on server-side
// For client-side, use `useGlobalStore` hook instead
export async function getPersistedGlobalStore() {
  const persistedState = await getCookies(GLOBAL_STORE_KEY);
  if (!persistedState) return initPersistedGlobalState();

  const { state } = JSON.parse(persistedState) as PersistedGlobal;

  return state;
}
