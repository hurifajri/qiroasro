import type { ColorMode } from '@xyflow/react';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import { cookiesStorage } from '@/lib/cookies-client';
import { getCookies } from '@/lib/cookies-server';

// Store keys
const GLOBAL_STORE_KEY = 'qiroasro_global-store';

export type WaitlistStatus =
  | 'idle'
  | 'success'
  | 'verified'
  | 'already_verified'
  | 'error';

export interface GlobalState {
  theme: ColorMode;
  waitlistStatus: WaitlistStatus;
}

export type PersistedGlobalState = Pick<GlobalState, 'theme'>;

interface PersistedGlobal {
  state: PersistedGlobalState;
  version: number;
}

interface GlobalAction {
  setTheme: (theme: ColorMode) => void;
  setWaitlistStatus: (status: WaitlistStatus) => void;
}

export type GlobalStore = GlobalState & GlobalAction;

function initPersistedGlobalState(): PersistedGlobalState {
  return { theme: 'light' };
}

export function initGlobalState(
  persistedState?: PersistedGlobalState,
): GlobalState {
  const initPersistedState = persistedState ?? initPersistedGlobalState();

  return { waitlistStatus: 'idle', ...initPersistedState };
}

export function createGlobalStore(globalState: GlobalState) {
  return createStore<GlobalStore>()(
    persist(
      (set) => ({
        ...globalState,
        setTheme: (theme) => set(() => ({ theme })),
        setWaitlistStatus: (status) => set(() => ({ waitlistStatus: status })),
      }),
      {
        name: GLOBAL_STORE_KEY,
        storage: createJSONStorage(() => cookiesStorage),
        skipHydration: true,
        partialize: (state) => ({
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
