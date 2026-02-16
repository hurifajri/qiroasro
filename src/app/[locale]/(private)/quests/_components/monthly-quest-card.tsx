import { Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getMonthlyGradientClasses } from '../_lib/mock-data';
import type { MonthlyQuest } from '../_schemas/quests';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MonthlyQuestCardProps {
  quest: MonthlyQuest;
}

export function MonthlyQuestCard({ quest }: MonthlyQuestCardProps) {
  const t = useTranslations('quests_page.monthly_quest');

  const progress = Math.min((quest.current / quest.target) * 100, 100);
  const timeLabel =
    quest.daysRemaining > 1
      ? t('days_remaining', { count: quest.daysRemaining })
      : t('hours_remaining', { count: quest.daysRemaining * 24 });

  return (
    <Card className={getMonthlyGradientClasses(quest.colorCode)}>
      <CardHeader>
        <CardAction>
          <Badge
            variant="secondary"
            className="bg-white/20 font-bold text-white backdrop-blur-sm"
          >
            {quest.month}
          </Badge>
        </CardAction>
        <CardTitle className="font-bold text-2xl">
          {t(quest.titleKey)}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 font-semibold text-sm text-white">
          <Clock className="size-4" />
          {timeLabel}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress */}
        <div className="rounded-2xl bg-zinc-900/30 p-4 backdrop-blur-sm">
          <span className="font-semibold">
            {t('complete_quests', { target: quest.target })}
          </span>
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
            <Avatar className={cn('size-8', quest.iconBg)}>
              <AvatarFallback className="bg-transparent text-lg">
                {quest.iconEmoji}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
