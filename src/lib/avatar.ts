/**
 * Avatar color constants and utilities
 */

/**
 * Avatar color map: semantic color codes → Tailwind classes
 * All classes are statically written so Tailwind JIT can detect them
 */
const SOLID_COLORS = {
  gray: 'bg-gray-500',
  stone: 'bg-stone-500',
  neutral: 'bg-neutral-500',
  zinc: 'bg-zinc-500',
  slate: 'bg-slate-500',
  yellow: 'bg-yellow-500',
  amber: 'bg-amber-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  rose: 'bg-rose-500',
  pink: 'bg-pink-500',
  fuchsia: 'bg-fuchsia-500',
  purple: 'bg-purple-500',
  violet: 'bg-violet-500',
  indigo: 'bg-indigo-500',
  blue: 'bg-blue-500',
  sky: 'bg-sky-500',
  cyan: 'bg-cyan-500',
  teal: 'bg-teal-500',
  emerald: 'bg-emerald-500',
  green: 'bg-green-500',
  lime: 'bg-lime-500',
} as const;

const GRADIENT_COLORS = {
  // High contrast
  emerald_rose: 'bg-gradient-to-br from-emerald-500 to-rose-500',
  rose_emerald: 'bg-gradient-to-br from-rose-500 to-emerald-500',
  amber_sky: 'bg-gradient-to-br from-amber-500 to-sky-500',
  sky_amber: 'bg-gradient-to-br from-sky-500 to-amber-500',
  teal_amber: 'bg-gradient-to-br from-teal-500 to-amber-500',
  amber_teal: 'bg-gradient-to-br from-amber-500 to-teal-500',
  rose_sky: 'bg-gradient-to-br from-rose-500 to-sky-500',
  sky_rose: 'bg-gradient-to-br from-sky-500 to-rose-500',
  indigo_rose: 'bg-gradient-to-br from-indigo-500 to-rose-500',
  rose_indigo: 'bg-gradient-to-br from-rose-500 to-indigo-500',
  rose_violet: 'bg-gradient-to-br from-rose-500 to-violet-500',
  violet_rose: 'bg-gradient-to-br from-violet-500 to-rose-500',

  // Split-complementary (avoid muddy colors in the middle of the gradient)
  fuchsia_cyan: 'bg-gradient-to-br from-fuchsia-500 to-cyan-500',
  cyan_fuchsia: 'bg-gradient-to-br from-cyan-500 to-fuchsia-500',
  purple_amber: 'bg-gradient-to-br from-purple-500 to-amber-500',
  amber_purple: 'bg-gradient-to-br from-amber-500 to-purple-500',
  orange_violet: 'bg-gradient-to-br from-orange-500 to-violet-500',
  violet_orange: 'bg-gradient-to-br from-violet-500 to-orange-500',

  // Analogous (smooth transition)
  teal_indigo: 'bg-gradient-to-br from-teal-500 to-indigo-500',
  indigo_teal: 'bg-gradient-to-br from-indigo-500 to-teal-500',
  pink_orange: 'bg-gradient-to-br from-pink-500 to-orange-500',
  orange_pink: 'bg-gradient-to-br from-orange-500 to-pink-500',
  cyan_blue: 'bg-gradient-to-br from-cyan-500 to-blue-500',
  blue_cyan: 'bg-gradient-to-br from-blue-500 to-cyan-500',

  // High energy / vibrant
  lime_blue: 'bg-gradient-to-br from-lime-500 to-blue-500',
  blue_lime: 'bg-gradient-to-br from-blue-500 to-lime-500',

  // Additional
  indigo_purple: 'bg-gradient-to-br from-indigo-500 to-purple-500',
  purple_indigo: 'bg-gradient-to-br from-purple-500 to-indigo-500',
  orange_rose: 'bg-gradient-to-br from-orange-500 to-rose-500',
  rose_orange: 'bg-gradient-to-br from-rose-500 to-orange-500',
  amber_pink: 'bg-gradient-to-br from-amber-500 to-pink-500',
  pink_amber: 'bg-gradient-to-br from-pink-500 to-amber-500',
  teal_emerald: 'bg-gradient-to-br from-teal-500 to-emerald-500',
  emerald_teal: 'bg-gradient-to-br from-emerald-500 to-teal-500',
  lime_green: 'bg-gradient-to-br from-lime-500 to-green-500',
  green_lime: 'bg-gradient-to-br from-green-500 to-lime-500',
  violet_fuchsia: 'bg-gradient-to-br from-violet-500 to-fuchsia-500',
  fuchsia_violet: 'bg-gradient-to-br from-fuchsia-500 to-violet-500',
  purple_pink: 'bg-gradient-to-br from-purple-500 to-pink-500',
  pink_purple: 'bg-gradient-to-br from-pink-500 to-purple-500',
} as const;

export const AVATAR_COLORS = { ...SOLID_COLORS, ...GRADIENT_COLORS } as const;
export type AvatarColorCode = keyof typeof AVATAR_COLORS;

/**
 * Solid color codes (for free users)
 */
export const AVATAR_SOLID_CODES = Object.keys(
  SOLID_COLORS,
) as AvatarColorCode[];

/**
 * Gradient color codes (premium only)
 */
export const AVATAR_GRADIENT_CODES = Object.keys(
  GRADIENT_COLORS,
) as AvatarColorCode[];

export const DEFAULT_AVATAR_COLOR_CODE: AvatarColorCode = 'gray';

/**
 * Get Tailwind classes for a given color code
 */
export function getAvatarColorClass(colorCode?: AvatarColorCode): string {
  if (!colorCode || !(colorCode in AVATAR_COLORS)) {
    return AVATAR_COLORS[DEFAULT_AVATAR_COLOR_CODE];
  }
  return AVATAR_COLORS[colorCode];
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
