import { createStore } from 'zustand/vanilla';

export type WaitlistStatus =
  | 'idle'
  | 'success'
  | 'verified'
  | 'already_verified'
  | 'error';

export interface GlobalState {
  waitlistStatus: WaitlistStatus;
}

interface GlobalAction {
  setWaitlistStatus: (status: WaitlistStatus) => void;
}

export type GlobalStore = GlobalState & GlobalAction;

export function initGlobalState(): GlobalState {
  return { waitlistStatus: 'idle' };
}

export function createGlobalStore(globalState: GlobalState) {
  return createStore<GlobalStore>()((set) => ({
    ...globalState,
    setWaitlistStatus: (status) => set(() => ({ waitlistStatus: status })),
  }));
}
