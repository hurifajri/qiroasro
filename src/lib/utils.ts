import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function kebabToSnakeCase(str: string): string {
  return str.replace(/-/g, '_');
}

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
