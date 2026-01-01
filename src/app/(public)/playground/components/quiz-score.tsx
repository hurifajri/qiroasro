'use client';

import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { QuizScoreCount } from '../schemas/graph';

export interface QuizScoreProps {
  score: QuizScoreCount;
}

const successStyles = 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-500';

export function QuizScore({ score }: QuizScoreProps) {
  const t = useTranslations('playground_page.quiz');
  const isUnanswered = score.correct === 0 && score.total === 0;
  const isAllCorrect = !isUnanswered && score.correct === score.total;
  const incorrect = score.total - score.correct;

  return (
    <div className="flex items-center gap-1">
      <Badge variant="default" className={cn('gap-2 px-3 py-4 [&>svg]:size-5!', successStyles)}>
        <CheckCircle2Icon />
        <span className="font-semibold text-base">
          {t('correct_score', { correct: score.correct })}
        </span>
      </Badge>
      <Badge variant="destructive" className={cn('gap-2 px-3 py-4 [&>svg]:size-5!')}>
        <XCircleIcon />
        <span className="font-semibold text-base">{t('incorrect_score', { incorrect })}</span>
      </Badge>
    </div>
  );
}
