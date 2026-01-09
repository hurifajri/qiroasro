'use client';

import { motion } from 'framer-motion';
import { BookOpenIcon, XCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ChallengeQuizAnalytic } from '../schemas/quiz';

interface ChallengeAnalyticsProps {
  analytics: ChallengeQuizAnalytic[];
}

export function ChallengeAnalytics({ analytics }: ChallengeAnalyticsProps) {
  const t = useTranslations('playground_page.quiz');

  const missedItems = analytics.filter((a) => a.errorType === 'missed').map((a) => a.item);
  const incorrectItems = analytics.filter((a) => a.errorType === 'incorrect').map((a) => a.item);

  if (analytics.length === 0) return null;

  return (
    <motion.div
      className="flex flex-col gap-2"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      {/* Missed connections */}
      {missedItems.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950">
          <div className="mb-1 flex items-center gap-2">
            <BookOpenIcon className="size-4 text-yellow-600" />
            <span className="font-medium text-sm text-yellow-800 dark:text-yellow-200">
              {t('challenge_weakness_missed')}
            </span>
          </div>
          <p className="text-right font-arabic text-xl text-yellow-700 dark:text-yellow-300">
            {missedItems.join(', ')}
          </p>
        </div>
      )}

      {/* Incorrect connections */}
      {incorrectItems.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
          <div className="mb-1 flex items-center gap-2">
            <XCircleIcon className="size-4 text-red-600" />
            <span className="font-medium text-red-800 text-sm dark:text-red-200">
              {t('challenge_weakness_incorrect')}
            </span>
          </div>
          <p className="text-right font-arabic text-red-700 text-xl dark:text-red-300">
            {incorrectItems.join(', ')}
          </p>
        </div>
      )}
    </motion.div>
  );
}
