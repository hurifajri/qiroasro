'use client';

import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { QuizScoreCount } from '../schemas/quiz';

export interface QuizScoreProps {
  score: QuizScoreCount;
}

const successStyles = 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-500';

export function QuizScore({ score }: QuizScoreProps) {
  const t = useTranslations('playground_page.quiz');
  const isUnanswered = score.correct === 0 && score.total === 0;
  const isAllCorrect = !isUnanswered && score.correct === score.total;
  const incorrect = score.total - score.correct;
  const isIncorrectSingleAnswer = score.correct === 0 && score.total === 1;

  return (
    <div className="flex items-center gap-1">
      {!isUnanswered && !isIncorrectSingleAnswer && (
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
            {isUnanswered
              ? t('unanswered_quiz')
              : isIncorrectSingleAnswer
                ? t('incorrect_single_answer')
                : t('incorrect_score', { incorrect })}
          </span>
        </Badge>
      )}
    </div>
  );
}
