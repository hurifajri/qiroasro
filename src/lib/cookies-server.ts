'use server';

import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';

export async function setCookies(
  key: string,
  value: string,
  option: Partial<ResponseCookie> = {},
) {
  const cookieStore = await cookies();

  cookieStore.set(key, value, option);
}

export async function getCookies(key: string) {
  const cookieStore = await cookies();

  return cookieStore.get(key)?.value;
}

export async function getAllCookies() {
  const cookieStore = await cookies();

  return cookieStore.getAll();
}

export async function deleteCookies(key: string) {
  const cookieStore = await cookies();

  cookieStore.delete(key);
}
