import type { EmojiColorCode } from '@/lib/colors';

export interface Achievement {
  id: string;
  titleKey: string;
  descriptionKey: string;
  emojiColorCode?: EmojiColorCode;
  emoji: string;
  levels: number[];
  level: number;
}
