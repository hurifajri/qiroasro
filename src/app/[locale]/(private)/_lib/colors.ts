/**
 * Color utilities - single source of truth for all color mappings
 * Ensures Tailwind JIT can detect all classes at build time
 */

/**
 * GRADIENT_COLORS — single-color gradient backgrounds
 * Used by: quest card bg, unit header bg
 */
const GRADIENT_COLORS = {
  rose: 'bg-gradient-to-br from-rose-400 to-rose-500 dark:from-rose-600 dark:to-rose-700',
  orange:
    'bg-gradient-to-br from-orange-400 to-orange-500 dark:from-orange-600 dark:to-orange-700',
  amber:
    'bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-600 dark:to-amber-700',
  yellow:
    'bg-gradient-to-br from-yellow-400 to-yellow-500 dark:from-yellow-600 dark:to-yellow-700',
  lime: 'bg-gradient-to-br from-lime-400 to-lime-500 dark:from-lime-600 dark:to-lime-700',
  green:
    'bg-gradient-to-br from-green-400 to-green-500 dark:from-green-600 dark:to-green-700',
  emerald:
    'bg-gradient-to-br from-emerald-400 to-emerald-500 dark:from-emerald-600 dark:to-emerald-700',
  teal: 'bg-gradient-to-br from-teal-400 to-teal-500 dark:from-teal-600 dark:to-teal-700',
  cyan: 'bg-gradient-to-br from-cyan-400 to-cyan-500 dark:from-cyan-600 dark:to-cyan-700',
  sky: 'bg-gradient-to-br from-sky-400 to-sky-500 dark:from-sky-600 dark:to-sky-700',
  blue: 'bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-700',
  indigo:
    'bg-gradient-to-br from-indigo-400 to-indigo-500 dark:from-indigo-600 dark:to-indigo-700',
  violet:
    'bg-gradient-to-br from-violet-400 to-violet-500 dark:from-violet-600 dark:to-violet-700',
  purple:
    'bg-gradient-to-br from-purple-400 to-purple-500 dark:from-purple-600 dark:to-purple-700',
  fuchsia:
    'bg-gradient-to-br from-fuchsia-400 to-fuchsia-500 dark:from-fuchsia-600 dark:to-fuchsia-700',
} as const;

export type GradientColorCode = keyof typeof GRADIENT_COLORS;

export const GRADIENT_COLOR_CODES = Object.keys(
  GRADIENT_COLORS,
) as GradientColorCode[];

export function getGradientColorClass(colorCode?: GradientColorCode) {
  if (!colorCode || !(colorCode in GRADIENT_COLORS)) {
    const DEFAULT_GRADIENT_COLOR_CODE: GradientColorCode = 'rose';
    return GRADIENT_COLORS[DEFAULT_GRADIENT_COLOR_CODE];
  }
  return GRADIENT_COLORS[colorCode];
}

/**
 * EMOJI_COLORS — multi-color gradient backgrounds for emoji/badge
 * Used by: monthly badge emoji bg, achievement emoji bg, quest reward icon bg
 */
const EMOJI_COLORS = {
  // badges
  orange_rose: 'bg-gradient-to-br from-orange-300 to-rose-500',
  blue_indigo: 'bg-gradient-to-br from-blue-400 to-indigo-600',
  violet_fuchsia: 'bg-gradient-to-br from-violet-500 to-fuchsia-700',
  lime_green: 'bg-gradient-to-br from-lime-400 to-green-600',
  yellow_amber: 'bg-gradient-to-br from-yellow-300 to-amber-500',
  amber_orange: 'bg-gradient-to-br from-amber-400 to-orange-600',
  slate_slate: 'bg-gradient-to-br from-slate-400 to-slate-600',
  indigo_blue: 'bg-gradient-to-br from-indigo-500 to-blue-900',
  stone_neutral: 'bg-gradient-to-br from-stone-500 to-neutral-700',
  sky_blue: 'bg-gradient-to-br from-sky-200 to-blue-400',
  slate_slate2: 'bg-gradient-to-br from-slate-700 to-slate-900',
  orange_red: 'bg-gradient-to-br from-orange-500 to-red-700',

  // achievements
  orange_red2: 'bg-gradient-to-br from-orange-400 to-red-600',
  sky_blue2: 'bg-gradient-to-br from-sky-300 to-blue-500',
  yellow_amber2: 'bg-gradient-to-br from-yellow-400 to-amber-600',
  rose_orange: 'bg-gradient-to-br from-rose-300 to-orange-400',
  indigo_purple: 'bg-gradient-to-br from-indigo-500 to-purple-900',
  emerald_teal2: 'bg-gradient-to-br from-emerald-400 to-teal-600',
  slate_gray: 'bg-gradient-to-br from-slate-400 to-gray-600',
  red_rose: 'bg-gradient-to-br from-red-500 to-rose-700',

  // orange_red: 'bg-gradient-to-br from-orange-400 to-red-500',
  rose_pink: 'bg-gradient-to-br from-rose-400 to-pink-500',
  // sky_blue: 'bg-gradient-to-br from-sky-400 to-blue-500',
  // blue_indigo: 'bg-gradient-to-br from-blue-400 to-indigo-500',
  indigo_violet: 'bg-gradient-to-br from-indigo-400 to-violet-500',
  emerald_teal: 'bg-gradient-to-br from-emerald-400 to-teal-500',
  // amber_orange: 'bg-gradient-to-br from-amber-400 to-orange-500',
  violet_purple: 'bg-gradient-to-br from-violet-400 to-purple-500',
  cyan_teal: 'bg-gradient-to-br from-cyan-400 to-teal-500',
} as const;

export type EmojiColorCode = keyof typeof EMOJI_COLORS;

export const EMOJI_COLOR_CODES = Object.keys(EMOJI_COLORS) as EmojiColorCode[];

export function getEmojiColorClass(colorCode?: EmojiColorCode) {
  if (!colorCode || !(colorCode in EMOJI_COLORS)) {
    const DEFAULT_EMOJI_COLOR_CODE: EmojiColorCode = 'orange_red';
    return EMOJI_COLORS[DEFAULT_EMOJI_COLOR_CODE];
  }
  return EMOJI_COLORS[colorCode];
}

/**
 * PRACTICE_COLORS — card bg/border/hover + icon text color
 * Used by: practice-item.tsx
 */
const PRACTICE_COLORS = {
  rose: {
    card: 'bg-rose-500/10 border-rose-500/30! hover:bg-rose-500/20',
    icon: 'text-rose-500',
  },
  emerald: {
    card: 'bg-emerald-500/10 border-emerald-500/30! hover:bg-emerald-500/20',
    icon: 'text-emerald-500',
  },
  amber: {
    card: 'bg-amber-500/10 border-amber-500/30! hover:bg-amber-500/20',
    icon: 'text-amber-500',
  },
  sky: {
    card: 'bg-sky-500/10 border-sky-500/30! hover:bg-sky-500/20',
    icon: 'text-sky-500',
  },
  purple: {
    card: 'bg-purple-500/10 border-purple-500/30! hover:bg-purple-500/20',
    icon: 'text-purple-500',
  },
  orange: {
    card: 'bg-orange-500/10 border-orange-500/30! hover:bg-orange-500/20',
    icon: 'text-orange-500',
  },
} as const;

type PracticeColorCode = keyof typeof PRACTICE_COLORS;

export function getPracticeColors(colorCode?: PracticeColorCode) {
  if (!colorCode || !(colorCode in PRACTICE_COLORS)) {
    const DEFAULT_PRACTICE_COLOR_CODE: PracticeColorCode = 'rose';
    return PRACTICE_COLORS[DEFAULT_PRACTICE_COLOR_CODE];
  }
  return PRACTICE_COLORS[colorCode];
}
