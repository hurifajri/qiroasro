import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a kebab-case string to camelCase.
 * @param str - The kebab-case string to convert (e.g., "my-variable-name")
 * @returns The camelCase version of the string (e.g., "myVariableName")
 */
export function kebabToCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
