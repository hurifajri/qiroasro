'use client';

import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { QuizScoreCount } from '../schemas/graph';

export interface QuizScoreProps {
  /** Score object with correct and total counts */
  score: QuizScoreCount;
  /** Additional CSS classes */
  className?: string;
}

const successStyles = 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-500';

/**
 * A reusable component to display quiz score with badge styling.
 * Shows success (green) when all answers are correct, error (red) otherwise.
 */
export function QuizScore({ score, className }: QuizScoreProps) {
  const t = useTranslations('playground_page.quiz');

  const isAllCorrect = score.correct === score.total;

  return (
    <Badge
      variant={isAllCorrect ? 'default' : 'destructive'}
      className={cn('gap-2 px-3 py-4 [&>svg]:size-5!', isAllCorrect && successStyles, className)}
    >
      {isAllCorrect ? <CheckCircle2Icon /> : <XCircleIcon />}
      <span className="font-semibold text-base">
        {t('score', { correct: score.correct, total: score.total })}
      </span>
    </Badge>
  );
}
