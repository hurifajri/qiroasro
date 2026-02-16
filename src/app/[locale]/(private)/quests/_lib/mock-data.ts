import type { MonthlyQuest } from '../_schemas/quests';

/**
 * Monthly color codes for gradient backgrounds
 * Each month has a unique color palette with WCAG AA compliant contrast
 * Based on seasonal weather and nature themes
 */
export const MONTHLY_COLOR_CODES = {
  JANUARY: 'blue', // Deep winter frost
  FEBRUARY: 'sky', // Late winter sky
  MARCH: 'emerald', // Early spring growth
  APRIL: 'teal', // Spring rain
  MAY: 'amber', // Warm spring sunshine
  JUNE: 'orange', // Early summer warmth
  JULY: 'rose', // Peak summer bloom
  AUGUST: 'purple', // Late summer twilight
  SEPTEMBER: 'violet', // Early autumn transition
  OCTOBER: 'fuchsia', // Autumn foliage
  NOVEMBER: 'cyan', // Cool late autumn
  DECEMBER: 'indigo', // Winter evening
} as const;

/**
 * Monthly reward icon emojis based on weather and nature
 * Each month represents seasonal characteristics without holiday references
 */
export const MONTHLY_ICONS = {
  JANUARY: '❄️', // Snowflake - deep winter
  FEBRUARY: '🌬️', // Wind - late winter winds
  MARCH: '🌱', // Seedling - spring growth begins
  APRIL: '🌸', // Cherry blossom - spring bloom
  MAY: '☀️', // Sun - warm spring sunshine
  JUNE: '🌻', // Sunflower - early summer
  JULY: '🔥', // Sun with face - peak summer
  AUGUST: '🌊', // Ocean wave - late summer
  SEPTEMBER: '🍂', // Fallen leaf - autumn begins
  OCTOBER: '🍁', // Maple leaf - peak autumn colors
  NOVEMBER: '🌾', // Sheaf of rice - harvest season
  DECEMBER: '🌨️', // Snow cloud - winter returns
} as const;

/**
 * Monthly reward icon background colors
 * Coordinated with the gradient theme for visual harmony
 */
export const MONTHLY_ICON_BACKGROUNDS = {
  JANUARY: 'bg-blue-100 dark:bg-blue-900/30',
  FEBRUARY: 'bg-sky-100 dark:bg-sky-900/30',
  MARCH: 'bg-emerald-100 dark:bg-emerald-900/30',
  APRIL: 'bg-teal-100 dark:bg-teal-900/30',
  MAY: 'bg-amber-100 dark:bg-amber-900/30',
  JUNE: 'bg-orange-100 dark:bg-orange-900/30',
  JULY: 'bg-rose-100 dark:bg-rose-900/30',
  AUGUST: 'bg-purple-100 dark:bg-purple-900/30',
  SEPTEMBER: 'bg-violet-100 dark:bg-violet-900/30',
  OCTOBER: 'bg-fuchsia-100 dark:bg-fuchsia-900/30',
  NOVEMBER: 'bg-cyan-100 dark:bg-cyan-900/30',
  DECEMBER: 'bg-indigo-100 dark:bg-indigo-900/30',
} as const;

/**
 * Gradient class mapping for each color code
 * Using 400-500 shades for light mode and 600-700 for dark mode
 * to ensure WCAG AA contrast (4.5:1 for normal text, 3:1 for large text)
 */
export function getMonthlyGradientClasses(colorCode: string): string {
  const gradientMap: Record<string, string> = {
    indigo:
      'bg-gradient-to-br from-indigo-400 to-indigo-500 dark:from-indigo-600 dark:to-indigo-700',
    rose: 'bg-gradient-to-br from-rose-400 to-rose-500 dark:from-rose-600 dark:to-rose-700',
    emerald:
      'bg-gradient-to-br from-emerald-400 to-emerald-500 dark:from-emerald-600 dark:to-emerald-700',
    sky: 'bg-gradient-to-br from-sky-400 to-sky-500 dark:from-sky-600 dark:to-sky-700',
    amber:
      'bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-600 dark:to-amber-700',
    purple:
      'bg-gradient-to-br from-purple-400 to-purple-500 dark:from-purple-600 dark:to-purple-700',
    orange:
      'bg-gradient-to-br from-orange-400 to-orange-500 dark:from-orange-600 dark:to-orange-700',
    teal: 'bg-gradient-to-br from-teal-400 to-teal-500 dark:from-teal-600 dark:to-teal-700',
    violet:
      'bg-gradient-to-br from-violet-400 to-violet-500 dark:from-violet-600 dark:to-violet-700',
    fuchsia:
      'bg-gradient-to-br from-fuchsia-400 to-fuchsia-500 dark:from-fuchsia-600 dark:to-fuchsia-700',
    cyan: 'bg-gradient-to-br from-cyan-400 to-cyan-500 dark:from-cyan-600 dark:to-cyan-700',
    blue: 'bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-700',
  };

  return gradientMap[colorCode] || gradientMap.rose;
}

/**
 * Mock monthly quest
 */
export const MOCK_MONTHLY_QUEST: MonthlyQuest = {
  month: 'FEBRUARY',
  titleKey: 'february_quest',
  target: 20,
  current: 0,
  daysRemaining: 14,
  colorCode: MONTHLY_COLOR_CODES.FEBRUARY,
  iconEmoji: MONTHLY_ICONS.FEBRUARY,
  iconBg: MONTHLY_ICON_BACKGROUNDS.FEBRUARY,
};
