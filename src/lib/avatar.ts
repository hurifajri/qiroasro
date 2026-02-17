/**
 * Avatar color constants and utilities
 */

/**
 * Avatar color map: semantic color codes → Tailwind classes
 * All classes are statically written so Tailwind JIT can detect them
 */
export const AVATAR_COLORS = {
  // Solid colors
  gray: 'bg-gray-500',
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  sky: 'bg-sky-500',
  violet: 'bg-violet-500',
  teal: 'bg-teal-500',
  orange: 'bg-orange-500',
  // Gradient colors
  indigo_rose: 'bg-gradient-to-br from-indigo-500 to-rose-500',
  rose_indigo: 'bg-gradient-to-br from-rose-500 to-indigo-500',
  emerald_rose: 'bg-gradient-to-br from-emerald-500 to-rose-500',
  rose_emerald: 'bg-gradient-to-br from-rose-500 to-emerald-500',
  amber_sky: 'bg-gradient-to-br from-amber-500 to-sky-500',
  sky_amber: 'bg-gradient-to-br from-sky-500 to-amber-500',
  teal_amber: 'bg-gradient-to-br from-teal-500 to-amber-500',
  amber_teal: 'bg-gradient-to-br from-amber-500 to-teal-500',
  rose_violet: 'bg-gradient-to-br from-rose-500 to-violet-500',
  violet_rose: 'bg-gradient-to-br from-violet-500 to-rose-500',
  rose_sky: 'bg-gradient-to-br from-rose-500 to-sky-500',
  sky_rose: 'bg-gradient-to-br from-sky-500 to-rose-500',
} as const;

export type AvatarColorCode = keyof typeof AVATAR_COLORS;

const DEFAULT_AVATAR_COLOR_CODE: AvatarColorCode = 'gray';

/**
 * Solid color codes (for free users)
 */
export const AVATAR_SOLID_CODES = [
  'gray',
  'indigo',
  'emerald',
  'amber',
  'rose',
  'sky',
  'violet',
  'teal',
  'orange',
] as const satisfies readonly AvatarColorCode[];

/**
 * Gradient color codes (premium only)
 */
export const AVATAR_GRADIENT_CODES = [
  'indigo_rose',
  'rose_indigo',
  'emerald_rose',
  'rose_emerald',
  'amber_sky',
  'sky_amber',
  'teal_amber',
  'amber_teal',
  'rose_violet',
  'violet_rose',
  'rose_sky',
  'sky_rose',
] as const satisfies readonly AvatarColorCode[];

/**
 * Get Tailwind classes for a given color code
 */
export function getAvatarColorClass(colorCode?: string | null): string {
  if (!colorCode || !(colorCode in AVATAR_COLORS)) {
    return AVATAR_COLORS[DEFAULT_AVATAR_COLOR_CODE];
  }
  return AVATAR_COLORS[colorCode as AvatarColorCode];
}

/**
 * Extract initials from a name
 * Max 2 letters: first letter of each word
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return words
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
}
