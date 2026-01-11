'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PracticeQuizScore } from '../schemas/quiz';

interface QuizScoreBaseProps {
  className?: string;
}

interface QuizScorePracticeProps extends QuizScoreBaseProps {
  mode: 'practice';
  score: PracticeQuizScore;
}

interface QuizScoreChallengeProps extends QuizScoreBaseProps {
  mode: 'challenge';
  totalPoint: number;
}

export type QuizScoreProps = QuizScorePracticeProps | QuizScoreChallengeProps;

const successStyles =
  'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-500';

/** Challenge mode score display with calendar flip animation */
function ChallengeScore({ totalPoint }: { totalPoint: number }) {
  const t = useTranslations('playground_page.quiz');

  // Determine gradient based on point value
  const getGradientClass = () => {
    if (totalPoint < 0) return 'bg-red-500';
    if (totalPoint > 0) return 'bg-green-500';
    return 'bg-slate-500';
  };

  return (
    <div
      className={cn(
        'relative flex h-8.5 w-20 items-center justify-center overflow-hidden rounded-full bg-linear-to-r px-4 py-1.5 font-medium text-sm text-white',
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
      <span>{t('challenge_point', { count: totalPoint })}</span>
    </div>
  );
}

export function QuizScore(props: QuizScoreProps) {
  const t = useTranslations('playground_page.quiz');

  // Challenge mode - animated point display
  if (props.mode === 'challenge') {
    return <ChallengeScore totalPoint={props.totalPoint} />;
  }

  // Practice mode - correct/incorrect badges
  const { score } = props;
  const isAllCorrect = score.correct === score.total;
  const incorrect = score.total - score.correct;
  const isIncorrectSingleAnswer = score.correct === 0 && score.total === 1;

  return (
    <div className={cn('flex items-center gap-1', props.className)}>
      {!isIncorrectSingleAnswer && (
        <Badge
          variant="default"
          className={cn('gap-2 px-3 py-4 [&>svg]:size-5!', successStyles)}
        >
          <CheckCircle2Icon />
          <span className="font-semibold text-base">
            {isAllCorrect
              ? t('all_correct')
              : t('correct_score', { correct: score.correct })}
          </span>
        </Badge>
      )}
      {!isAllCorrect && (
        <Badge
          variant="destructive"
          className={cn('gap-2 px-3 py-4 [&>svg]:size-5!')}
        >
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
