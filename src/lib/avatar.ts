/**
 * Avatar color constants and utilities
 */

/**
 * Avatar color map: semantic color codes → Tailwind classes
 * All classes are statically written so Tailwind JIT can detect them
 */
export const AVATAR_COLORS = {
  // Solid colors
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
  emerald_teal: 'bg-gradient-to-br from-emerald-500 to-teal-500',
  amber_orange: 'bg-gradient-to-br from-amber-500 to-orange-500',
  sky_indigo: 'bg-gradient-to-br from-sky-500 to-indigo-500',
  rose_violet: 'bg-gradient-to-br from-rose-500 to-violet-500',
  teal_sky: 'bg-gradient-to-br from-teal-500 to-sky-500',
} as const;

export type AvatarColorCode = keyof typeof AVATAR_COLORS;

export const DEFAULT_AVATAR_COLOR_CODE: AvatarColorCode = 'indigo';

/**
 * Solid color codes (for free users)
 */
export const AVATAR_SOLID_CODES = [
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
 * Gradient color codes (premium only - future)
 */
export const AVATAR_GRADIENT_CODES = [
  'indigo_rose',
  'emerald_teal',
  'amber_orange',
  'sky_indigo',
  'rose_violet',
  'teal_sky',
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
