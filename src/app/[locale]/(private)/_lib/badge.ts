import type { MonthlyBadge } from '../_schemas/badge';
import type { CardColorCode, EmojiColorCode } from './colors';

/**
 * Monthly badges
 * TODO: Move to db
 */
export const MONTHLY_BADGES: MonthlyBadge[] = [
  {
    id: 'pen',
    titleKey: 'badges.pen.title',
    descriptionKey: 'badges.pen.description',
    emoji: '✒️', // Fountain Pen Nib (Pena/Ilmu)
    emojiColorCode: 'blue_indigo',
  },
  {
    id: 'stars',
    titleKey: 'badges.stars.title',
    descriptionKey: 'badges.stars.description',
    emoji: '🌌', // Milky Way (Gugusan Bintang/Buruj)
    emojiColorCode: 'indigo_blue',
  },
  {
    id: 'fig',
    titleKey: 'badges.fig.title',
    descriptionKey: 'badges.fig.description',
    emoji: '🍃', // Leaf (Daun Pohon Tin/Alam) - *Fig emoji tidak umum, daun lebih representatif untuk kesuburan*
    emojiColorCode: 'lime_green',
  },
  {
    id: 'iron',
    titleKey: 'badges.iron.title',
    descriptionKey: 'badges.iron.description',
    emoji: '⛓️', // Chains (Besi/Kekuatan/Ikatan Kuat)
    emojiColorCode: 'slate_slate',
  },
  {
    id: 'dawn',
    titleKey: 'badges.dawn.title',
    descriptionKey: 'badges.dawn.description',
    emoji: '🌅', // Sunrise (Fajar)
    emojiColorCode: 'orange_rose',
  },
  {
    id: 'sun',
    titleKey: 'badges.sun.title',
    descriptionKey: 'badges.sun.description',
    emoji: '☀️', // Sun (Matahari/Kecerahan)
    emojiColorCode: 'amber_orange',
  },
  {
    id: 'declining_day',
    titleKey: 'badges.declining_day.title',
    descriptionKey: 'badges.declining_day.description',
    emoji: '⏳', // Hourglass (Waktu yang berjalan/Demi Masa)
    emojiColorCode: 'orange_red',
  },
  {
    id: 'thunder',
    titleKey: 'badges.thunder.title',
    descriptionKey: 'badges.thunder.description',
    emoji: '⚡', // High Voltage (Guruh/Kekuatan)
    emojiColorCode: 'violet_fuchsia',
  },
  {
    id: 'night',
    titleKey: 'badges.night.title',
    descriptionKey: 'badges.night.description',
    emoji: '🕯️', // Candle (Cahaya di kegelapan malam/Tahajjud)
    emojiColorCode: 'slate_slate2',
  },
  {
    id: 'mount',
    titleKey: 'badges.mount.title',
    descriptionKey: 'badges.mount.description',
    emoji: '⛰️', // Mountain (Gunung/Kekokohan)
    emojiColorCode: 'stone_neutral',
  },
  {
    id: 'star',
    titleKey: 'badges.star.title',
    descriptionKey: 'badges.star.description',
    emoji: '🌟', // Glowing Star (Bintang Petunjuk)
    emojiColorCode: 'yellow_amber',
  },
  {
    id: 'moon',
    titleKey: 'badges.moon.title',
    descriptionKey: 'badges.moon.description',
    emoji: '🌕', // Full Moon (Bulan Purnama/Cahaya Lembut)
    emojiColorCode: 'sky_blue',
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
 * colorCode: for quest card background (CARD_COLORS)
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
    colorCode: CardColorCode;
    emojiColorCode: EmojiColorCode;
    emoji: string;
  }
>;

export function getMonthlyTheme(month: number) {
  return (
    MONTHLY_THEMES[month as keyof typeof MONTHLY_THEMES] ?? MONTHLY_THEMES[1]
  );
}
