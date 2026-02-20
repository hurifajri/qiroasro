import type { MonthlyBadge } from '../_schemas/badge';
import type { EmojiColorCode, GradientColorCode } from './colors';

/**
 * Monthly badges
 * TODO: Move to db
 */
export const MONTHLY_BADGES: MonthlyBadge[] = [
  {
    id: 'january_dawn',
    titleKey: 'badges.january_dawn.title',
    descriptionKey: 'badges.january_dawn.description',
    emoji: '🌅', // Sunrise (Fajar)
    emojiColorCode: 'orange_rose',
  },
  {
    id: 'february_pen',
    titleKey: 'badges.february_pen.title',
    descriptionKey: 'badges.february_pen.description',
    emoji: '✒️', // Fountain Pen Nib (Pena/Ilmu)
    emojiColorCode: 'blue_indigo',
  },
  {
    id: 'march_thunder',
    titleKey: 'badges.march_thunder.title',
    descriptionKey: 'badges.march_thunder.description',
    emoji: '⚡', // High Voltage (Guruh/Kekuatan)
    emojiColorCode: 'violet_fuchsia',
  },
  {
    id: 'april_fig',
    titleKey: 'badges.april_fig.title',
    descriptionKey: 'badges.april_fig.description',
    emoji: '🍃', // Leaf (Daun Pohon Tin/Alam) - *Fig emoji tidak umum, daun lebih representatif untuk kesuburan*
    emojiColorCode: 'lime_green',
  },
  {
    id: 'may_star',
    titleKey: 'badges.may_star.title',
    descriptionKey: 'badges.may_star.description',
    emoji: '🌟', // Glowing Star (Bintang Petunjuk)
    emojiColorCode: 'yellow_amber',
  },
  {
    id: 'june_sun',
    titleKey: 'badges.june_sun.title',
    descriptionKey: 'badges.june_sun.description',
    emoji: '☀️', // Sun (Matahari/Kecerahan)
    emojiColorCode: 'amber_orange',
  },
  {
    id: 'july_iron',
    titleKey: 'badges.july_iron.title',
    descriptionKey: 'badges.july_iron.description',
    emoji: '⛓️', // Chains (Besi/Kekuatan/Ikatan Kuat)
    emojiColorCode: 'slate_slate',
  },
  {
    id: 'august_stars',
    titleKey: 'badges.august_stars.title',
    descriptionKey: 'badges.august_stars.description',
    emoji: '🌌', // Milky Way (Gugusan Bintang/Buruj)
    emojiColorCode: 'indigo_blue',
  },
  {
    id: 'september_mount',
    titleKey: 'badges.september_mount.title',
    descriptionKey: 'badges.september_mount.description',
    emoji: '⛰️', // Mountain (Gunung/Kekokohan)
    emojiColorCode: 'stone_neutral',
  },
  {
    id: 'october_moon',
    titleKey: 'badges.october_moon.title',
    descriptionKey: 'badges.october_moon.description',
    emoji: '🌕', // Full Moon (Bulan Purnama/Cahaya Lembut)
    emojiColorCode: 'sky_blue',
  },
  {
    id: 'november_night',
    titleKey: 'badges.november_night.title',
    descriptionKey: 'badges.november_night.description',
    emoji: '🕯️', // Candle (Cahaya di kegelapan malam/Tahajjud)
    emojiColorCode: 'slate_slate2',
  },
  {
    id: 'december_declining_day',
    titleKey: 'badges.december_declining_day.title',
    descriptionKey: 'badges.december_declining_day.description',
    emoji: '⏳', // Hourglass (Waktu yang berjalan/Demi Masa)
    emojiColorCode: 'orange_red',
  },
];

function getMonthlyBadge(month: number) {
  const selectedBadge = MONTHLY_BADGES[month - 1];
  return {
    emoji: selectedBadge.emoji,
    emojiColorCode: selectedBadge.emojiColorCode ?? 'orange_red',
  };
}

/**
 * MONTHLY_THEMES — per-month configuration
 * colorCode: for quest card background (GRADIENT_COLORS)
 * emojiColorCode: for emoji/badge background (EMOJI_COLORS)
 */
const MONTHLY_THEMES = {
  1: { colorCode: 'blue', ...getMonthlyBadge(1) },
  2: { colorCode: 'sky', ...getMonthlyBadge(2) },
  3: { colorCode: 'emerald', ...getMonthlyBadge(3) },
  4: { colorCode: 'teal', ...getMonthlyBadge(4) },
  5: { colorCode: 'amber', ...getMonthlyBadge(5) },
  6: { colorCode: 'orange', ...getMonthlyBadge(6) },
  7: { colorCode: 'rose', ...getMonthlyBadge(7) },
  8: { colorCode: 'purple', ...getMonthlyBadge(8) },
  9: { colorCode: 'violet', ...getMonthlyBadge(9) },
  10: { colorCode: 'fuchsia', ...getMonthlyBadge(10) },
  11: { colorCode: 'cyan', ...getMonthlyBadge(11) },
  12: { colorCode: 'indigo', ...getMonthlyBadge(12) },
} as const satisfies Record<
  number,
  {
    colorCode: GradientColorCode;
    emojiColorCode: EmojiColorCode;
    emoji: string;
  }
>;

export function getMonthlyTheme(month: number) {
  return (
    MONTHLY_THEMES[month as keyof typeof MONTHLY_THEMES] ?? MONTHLY_THEMES[1]
  );
}
