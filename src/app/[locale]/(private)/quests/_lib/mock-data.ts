import type { MonthlyBadge, MonthlyQuest } from '../_schemas/quests';

/**
 * Mock monthly quest
 */
export const MOCK_MONTHLY_QUEST: MonthlyQuest = {
  month: 'FEBRUARY',
  titleKey: 'monthly_quest.february_quest',
  target: 20,
  current: 0,
  daysRemaining: 14,
};

/**
 * Mock monthly badges
 */
export const MOCK_MONTHLY_BADGES: MonthlyBadge[] = [
  {
    id: 1,
    titleKey: 'badges.oscars_final_rose.title',
    dateKey: 'badges.oscars_final_rose.date',
    iconEmoji: '🌹',
    iconBg: 'bg-rose-100 dark:bg-rose-900/30',
  },
  {
    id: 2,
    titleKey: 'badges.duos_frozen_winter.title',
    dateKey: 'badges.duos_frozen_winter.date',
    iconEmoji: '❄️',
    iconBg: 'bg-sky-100 dark:bg-sky-900/30',
  },
  {
    id: 3,
    titleKey: 'badges.oscars_ode_to_botticelli.title',
    dateKey: 'badges.oscars_ode_to_botticelli.date',
    iconEmoji: '🎨',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    id: 4,
    titleKey: 'badges.duocon_2024.title',
    dateKey: 'badges.duocon_2024.date',
    iconEmoji: '🎯',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  {
    id: 5,
    titleKey: 'badges.summer_owlympics.title',
    dateKey: 'badges.summer_owlympics.date',
    iconEmoji: '🏅',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
];
