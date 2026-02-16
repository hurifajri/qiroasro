import type { MonthlyQuest } from '../_schemas/quests';

/**
 * Monthly color codes for gradient backgrounds
 * Each month has a unique color palette with WCAG AA compliant contrast
 */
export const MONTHLY_COLOR_CODES = {
  JANUARY: 'indigo', // Winter blue
  FEBRUARY: 'rose', //
  MARCH: 'emerald', // Spring green
  APRIL: 'sky', // Spring sky
  MAY: 'amber', // Warm spring
  JUNE: 'purple', // Summer vibrancy
  JULY: 'orange', // Summer heat
  AUGUST: 'teal', // Tropical summer
  SEPTEMBER: 'violet', // Autumn transition
  OCTOBER: 'fuchsia', // Fall colors
  NOVEMBER: 'cyan', // Cool autumn
  DECEMBER: 'blue', // Winter frost
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
};
