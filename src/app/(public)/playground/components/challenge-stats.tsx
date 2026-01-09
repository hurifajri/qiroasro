'use client';

import { motion } from 'framer-motion';
import { BowArrowIcon, CheckCircleIcon, TimerIcon, TrophyIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { memo, useMemo } from 'react';
import { cn, parseDuration } from '@/lib/utils';
import type {
  ChallengeConnectionStatItem,
  ChallengeQuizResult,
  ChallengeStatGridItem,
} from '../schemas/quiz';

interface ChallengeStatsProps {
  result: ChallengeQuizResult;
  accuracy: number;
}

export const ChallengeStats = memo(function ChallengeStats({
  result,
  accuracy,
}: ChallengeStatsProps) {
  const t = useTranslations('playground_page.quiz');
  const duration = parseDuration(result.totalTime);

  const statsGridItems: ChallengeStatGridItem[] = useMemo(
    () => [
      {
        icon: TrophyIcon,
        value: String(result.score.totalPoint),
        labelKey: 'challenge_total_point',
        bgClass: 'bg-indigo-50 dark:bg-indigo-950',
        iconClass: 'text-indigo-600',
        valueClass: 'text-xl text-indigo-700 dark:text-indigo-400',
      },
      {
        icon: TimerIcon,
        value: `${duration.minutes}:${duration.seconds.toString().padStart(2, '0')}`,
        labelKey: 'challenge_total_time',
        bgClass: 'bg-cyan-50 dark:bg-cyan-950',
        iconClass: 'text-cyan-600',
        valueClass: 'text-xl text-cyan-700 dark:text-cyan-400',
      },
      {
        icon: CheckCircleIcon,
        value: `${result.perfectQuestion}/${result.totalQuestion}`,
        labelKey: 'challenge_perfect_question',
        bgClass: 'bg-green-50 dark:bg-green-950',
        iconClass: 'text-green-600',
        valueClass: 'text-xl text-green-700 dark:text-green-400',
      },
      {
        icon: BowArrowIcon,
        value: `${accuracy}%`,
        labelKey: 'challenge_accuracy',
        bgClass: 'bg-amber-50 dark:bg-amber-950',
        iconClass: 'text-amber-600',
        valueClass: 'text-xl text-amber-700 dark:text-amber-400',
      },
    ],
    [result, accuracy, duration],
  );

  const connectionStats: ChallengeConnectionStatItem[] = useMemo(
    () => [
      {
        value: String(result.score.correctConnection),
        labelKey: 'challenge_correct_connection',
        valueClass: 'text-green-600',
      },
      {
        value: String(result.score.incorrectConnection),
        labelKey: 'challenge_incorrect_connection',
        valueClass: 'text-red-600',
      },
    ],
    [result.score],
  );

  return (
    <>
      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-2 gap-3"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {statsGridItems.map((stat) => (
          <div
            key={stat.labelKey}
            className={cn('flex flex-col items-center rounded-lg p-3', stat.bgClass)}
          >
            <stat.icon className={cn('mb-1 size-5', stat.iconClass)} />
            <span className={cn('font-bold', stat.valueClass)}>{stat.value}</span>
            <span className="text-muted-foreground text-xs">{t(stat.labelKey)}</span>
          </div>
        ))}
      </motion.div>

      {/* Connection Stats */}
      <motion.div
        className="flex justify-around rounded-lg border p-3 dark:border-muted"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {connectionStats.map((stat) => (
          <div key={stat.labelKey} className="flex flex-col items-center">
            <span className={cn('font-semibold text-lg', stat.valueClass)}>{stat.value}</span>
            <span className="text-muted-foreground text-xs">{t(stat.labelKey)}</span>
          </div>
        ))}
      </motion.div>
    </>
  );
});
