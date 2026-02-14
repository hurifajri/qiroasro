import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { MonthlyQuest } from '../_schemas/quests';

interface MonthlyQuestCardProps {
  quest: MonthlyQuest;
}

export function MonthlyQuestCard({ quest }: MonthlyQuestCardProps) {
  const t = useTranslations('quests_page');

  const progress = Math.min((quest.current / quest.target) * 100, 100);
  const timeLabel =
    quest.daysRemaining > 1
      ? t('days_remaining', { count: quest.daysRemaining })
      : t('hours_remaining', { count: quest.daysRemaining * 24 });

  return (
    <Card className="overflow-hidden border-none bg-linear-to-br from-rose-400 to-rose-500 text-white dark:from-rose-600 dark:to-rose-700">
      <CardContent className="flex flex-col gap-4 p-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <Badge
            variant="secondary"
            className="w-fit bg-white/20 font-bold text-white backdrop-blur-sm"
          >
            {quest.month}
          </Badge>
          <h2 className="font-bold text-2xl">{t(quest.titleKey)}</h2>
          <div className="flex items-center gap-1.5 text-sm opacity-90">
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Clock</title>
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeWidth="2" d="M12 6v6l4 2" />
            </svg>
            <span>{timeLabel}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="rounded-2xl bg-zinc-900/30 p-4 backdrop-blur-sm">
          <h3 className="mb-3 font-semibold">
            {t('complete_quests', { target: quest.target })}
          </h3>
          <div className="flex items-center gap-3">
            {/* Progress bar */}
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-700/50">
              <div
                className={cn(
                  'h-full rounded-full bg-white transition-all duration-300',
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Count */}
            <span className="font-bold text-sm">
              {quest.current} / {quest.target}
            </span>
            {/* Reward icon */}
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500">
              <span className="text-lg">🦉</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
