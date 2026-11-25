import type { EmojiColorCode } from '@/lib/colors';

export interface MonthlyBadge {
  id: string;
  titleKey: string;
  descriptionKey: string;
  emoji: string;
  emojiColorCode?: EmojiColorCode;
}
