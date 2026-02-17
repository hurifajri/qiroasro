'use client';

import { Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';
import type { Quest } from '../../_schemas/private';
import type { MonthlyQuest } from '../_schemas/quests';
import { DailyQuestList } from './daily-quest-list';
import { MonthlyQuestCard } from './monthly-quest-card';

interface QuestsProps {
  monthlyQuest: MonthlyQuest;
  dailyQuests: Quest[];
}

export function Quests({ monthlyQuest, dailyQuests }: QuestsProps) {
  const t = useTranslations('quests_page');

  return (
    <div className="flex flex-col gap-6">
      {/* Monthly Quest Hero */}
      <section>
        <MonthlyQuestCard quest={monthlyQuest} />
      </section>

      <Separator />

      {/* Daily Quests */}
      <section className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-2">
          <h2 className="font-bold text-xl">{t('daily_quests.title')}</h2>
          <div className="flex items-center gap-1 text-amber-600 text-sm dark:text-amber-500">
            <Clock className="size-4" />
            <span className="font-semibold uppercase">
              {t('daily_quests.hours_remaining', { count: 7 })}
            </span>
          </div>
        </div>
        <DailyQuestList quests={dailyQuests} />
      </section>
    </div>
  );
}
