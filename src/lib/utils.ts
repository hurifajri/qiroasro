import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function kebabToCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function kebabToSnakeCase(str: string): string {
  return str.replace(/-/g, '_');
}

export function kebabToSpaced(str: string): string {
  return str.replace(/-/g, ' ');
}

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
