'use client';

import { motion } from 'framer-motion';
import { CheckIcon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { ChallengeQuestionStat } from '../schemas/quiz';

interface ChallengeProgressProps {
  currentIndex: number;
  totalQuestion: number;
  questionStat: ChallengeQuestionStat[];
}

export function ChallengeProgress({
  currentIndex,
  totalQuestion,
  questionStat,
}: ChallengeProgressProps) {
  const t = useTranslations('playground_page.quiz');

  return (
    <div className="flex flex-col gap-2">
      <span className="text-center text-muted-foreground text-sm">
        {t('question_of', { current: currentIndex + 1, total: totalQuestion })}
      </span>

      <div className="flex justify-center gap-1.5">
        {Array.from({ length: totalQuestion }, (_, i) => `question-${i + 1}`).map((key, index) => {
          const stat = questionStat[index];
          const isCurrent = index === currentIndex;
          const isPast = index < currentIndex;
          const isPerfect = stat?.isPerfect;

          return (
            <motion.div
              key={key}
              className={cn(
                'flex size-6 items-center justify-center rounded-full border-2 font-medium text-xs transition-all',
                isCurrent && 'scale-110 border-primary bg-primary text-primary-foreground',
                isPast && isPerfect && 'border-green-500 bg-green-500 text-white',
                isPast && !isPerfect && 'border-red-500 bg-red-500 text-white',
                !isCurrent && !isPast && 'border-muted-foreground/30 bg-muted/50',
              )}
              initial={isCurrent ? { scale: 0.8 } : false}
              animate={isCurrent ? { scale: 1.1 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {isPast ? (
                isPerfect ? (
                  <CheckIcon className="size-3.5" />
                ) : (
                  <XIcon className="size-3.5" />
                )
              ) : (
                index + 1
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
