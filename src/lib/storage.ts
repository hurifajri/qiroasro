import type { StateStorage } from 'zustand/middleware';
import { deleteCookies, getCookies, setCookies } from './cookies';

export const cookiesStorage: StateStorage = {
  getItem: async (key: string) => (await getCookies(key)) ?? null,
  setItem: async (key: string, value: string) => await setCookies(key, value),
  removeItem: async (key: string) => await deleteCookies(key),
};
