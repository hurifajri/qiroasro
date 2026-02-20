import { getMonthlyTheme } from '../../_lib/badge';
import type { MonthlyQuest } from '../_schemas/quests';

/**
 * Mock monthly quest - using current month (February = 2)
 */
const currentMonth = 2;
const monthlyTheme = getMonthlyTheme(currentMonth);

export const MOCK_MONTHLY_QUEST: MonthlyQuest = {
  month: currentMonth,
  titleKey: 'february_quest',
  target: 20,
  current: 0,
  daysRemaining: 14,
  colorCode: monthlyTheme.colorCode,
  emoji: monthlyTheme.emoji,
  emojiColorCode: monthlyTheme.emojiColorCode,
};
