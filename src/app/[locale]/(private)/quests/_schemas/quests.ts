import type { CardColorCode, EmojiColorCode } from '@/lib/colors';

export interface MonthlyQuest {
  month: number;
  titleKey: string;
  target: number;
  current: number;
  daysRemaining: number;
  colorCode?: CardColorCode;
  emoji: string;
  emojiColorCode?: EmojiColorCode;
}
