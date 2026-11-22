'use client';

import { Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { Quest } from '../../_schemas/private';
import type { MonthlyQuest } from '../_schemas/quests';
import { DailyQuestList } from './daily-quest-list';
import { MonthlyQuestCard } from './monthly-quest-card';

interface QuestsProps {
  monthlyQuest: MonthlyQuest;
  dailyQuests: Quest[];
}

export function Quests({ monthlyQuest, dailyQuests }: Readonly<QuestsProps>) {
  const t = useTranslations('quests_page');

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {/* Monthly Quest Hero */}
      <MonthlyQuestCard quest={monthlyQuest} />

      {/* Daily Quests */}
      <div className="flex flex-col gap-3">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-bold">{t('daily_quests.title')}</h2>
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-500">
            <Clock className="size-4" />
            <p className="text-sm font-semibold uppercase">
              {t('daily_quests.hours_remaining', { count: 7 })}
            </p>
          </div>
        </div>
        <DailyQuestList quests={dailyQuests} />
      </div>
    </div>
  );
}
