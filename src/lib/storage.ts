import Cookies from 'js-cookie';
import type { StateStorage } from 'zustand/middleware';

/**
 * Client-side cookies storage for Zustand persist.
 * Uses js-cookie for synchronous access (works with Zustand persist).
 * For server-side, use `getCookies` function from src/lib/cookies.ts instead.
 */
export const cookiesStorage: StateStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;
    return Cookies.get(key) ?? null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    Cookies.set(key, value, {
      expires: 365, // 1 year
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    Cookies.remove(key);
  },
};
