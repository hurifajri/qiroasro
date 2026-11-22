import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function spaceToKebabCase(str: string): string {
  const normalized = str
    .toLowerCase()
    .replace(/[^\p{L}0-9\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  let start = 0;
  let end = normalized.length;
  while (start < end && normalized[start] === '-') start++;
  while (end > start && normalized[end - 1] === '-') end--;
  return normalized.slice(start, end);
}

export function kebabToSnakeCase(str: string): string {
  return str.replace(/-/g, '_');
}

export interface Duration {
  minutes: number;
  seconds: number;
}

export function parseDuration(ms: number): Duration {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { minutes, seconds };
}

export function secureRandom(): number {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] / 2 ** 32;
}
