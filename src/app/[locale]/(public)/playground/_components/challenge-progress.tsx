'use client';

import { CheckIcon, XIcon } from 'lucide-react';
import * as m from 'motion/react-m';

// import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

import type { ChallengeQuizQuestionScore } from '../_schemas/quiz';

type ChallengeProgressProps = Readonly<{
  currQuestionIdx: number;
  totalQuestion: number;
  questionScores: ChallengeQuizQuestionScore[];
}>;

function renderStepContent(
  isPast: boolean,
  isPerfect: boolean | undefined,
  index: number,
) {
  if (!isPast) return <span>{index + 1}</span>;
  return isPerfect ? (
    <CheckIcon className="size-3.5" />
  ) : (
    <XIcon className="size-3.5" />
  );
}

export function ChallengeProgress({
  currQuestionIdx,
  totalQuestion,
  questionScores,
}: ChallengeProgressProps) {
  // const t = useTranslations('playground_page.quiz');

  return (
    <div className="flex flex-col gap-2">
      {/* <span className="text-center text-muted-foreground text-sm">
        {t('challenge_question_of', { current: currentIndex + 1, total: totalQuestion })}
      </span> */}

      <div className="flex justify-center gap-1.5">
        {Array.from(
          { length: totalQuestion },
          (_, i) => `question-${i + 1}`,
        ).map((key, index) => {
          const stat = questionScores[index];
          const isCurrent = index === currQuestionIdx;
          const isPast = index < currQuestionIdx;
          const isPerfect = stat?.isPerfect;

          return (
            <m.div
              key={key}
              className={cn(
                'flex size-6 items-center justify-center rounded-full border-2 text-xs font-medium transition-all',
                isCurrent &&
                  'scale-110 border-primary bg-primary text-primary-foreground',
                isPast &&
                  isPerfect &&
                  'border-green-500 bg-green-500 text-white',
                isPast && !isPerfect && 'border-red-500 bg-red-500 text-white',
                !isCurrent &&
                  !isPast &&
                  'border-muted-foreground/30 bg-muted/50',
              )}
              initial={isCurrent ? { scale: 0.8 } : false}
              animate={isCurrent ? { scale: 1.1 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {renderStepContent(isPast, isPerfect, index)}
            </m.div>
          );
        })}
      </div>
    </div>
  );
}
