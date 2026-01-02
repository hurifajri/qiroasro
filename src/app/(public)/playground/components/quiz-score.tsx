'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { QuizScoreCount } from '../schemas/quiz';

interface QuizScoreBaseProps {
  className?: string;
}

interface QuizScoreRegularProps extends QuizScoreBaseProps {
  /** Display mode: regular shows correct/incorrect badges */
  variant: 'regular';
  /** Score count for regular mode */
  score: QuizScoreCount;
}

interface QuizScoreChallengeProps extends QuizScoreBaseProps {
  /** Display mode: challenge shows total points */
  variant: 'challenge';
  /** Total points for challenge mode */
  totalPoint: number;
}

export type QuizScoreProps = QuizScoreRegularProps | QuizScoreChallengeProps;

const successStyles = 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-500';

/** Challenge mode score display with calendar flip animation */
function ChallengeScore({ totalPoint, className }: { totalPoint: number; className?: string }) {
  const t = useTranslations('playground_page.quiz');

  // Determine gradient based on point value
  const getGradientClass = () => {
    if (totalPoint < 0) {
      return 'from-red-500 via-rose-500 to-orange-500';
    }
    if (totalPoint > 0) {
      return 'from-emerald-400 via-green-500 to-teal-500';
    }
    return 'from-slate-400 via-slate-500 to-slate-600';
  };

  return (
    <div
      className={cn(
        'relative flex w-20 items-center justify-center overflow-hidden rounded-full bg-linear-to-r px-4 py-1.5 font-medium text-sm text-white',
        getGradientClass(),
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={totalPoint}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {totalPoint}
        </motion.span>
      </AnimatePresence>
      &nbsp;
      <span>{t('point', { count: totalPoint })}</span>
    </div>
  );
}

export function QuizScore(props: QuizScoreProps) {
  const t = useTranslations('playground_page.quiz');

  // Challenge mode - animated point display
  if (props.variant === 'challenge') {
    return <ChallengeScore totalPoint={props.totalPoint} className={props.className} />;
  }

  // Regular mode - correct/incorrect badges
  const { score } = props;
  const isAllCorrect = score.correct === score.total;
  const incorrect = score.total - score.correct;
  const isIncorrectSingleAnswer = score.correct === 0 && score.total === 1;

  return (
    <div className={cn('flex items-center gap-1', props.className)}>
      {!isIncorrectSingleAnswer && (
        <Badge variant="default" className={cn('gap-2 px-3 py-4 [&>svg]:size-5!', successStyles)}>
          <CheckCircle2Icon />
          <span className="font-semibold text-base">
            {isAllCorrect ? t('all_correct') : t('correct_score', { correct: score.correct })}
          </span>
        </Badge>
      )}
      {!isAllCorrect && (
        <Badge variant="destructive" className={cn('gap-2 px-3 py-4 [&>svg]:size-5!')}>
          <XCircleIcon />
          <span className="font-semibold text-base">
            {isIncorrectSingleAnswer
              ? t('incorrect_single_answer')
              : t('incorrect_score', { incorrect })}
          </span>
        </Badge>
      )}
    </div>
  );
}
