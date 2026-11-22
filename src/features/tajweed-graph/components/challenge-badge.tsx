'use client';

import * as m from 'motion/react-m';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { getBadge } from '../lib/challenge-results';
import type { ChallengeQuizDifficulty } from '../schemas/quiz';

interface ChallengeBadgeProps {
  difficulty: ChallengeQuizDifficulty;
  accuracy: number;
}

export function ChallengeBadge({
  difficulty,
  accuracy,
}: Readonly<ChallengeBadgeProps>) {
  const t = useTranslations('playground_page.quiz');
  const badge = getBadge(accuracy);

  return (
    <m.div
      className="flex flex-col items-center gap-2"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <span className="text-6xl">{badge.emoji}</span>
      <span className={cn('text-2xl font-bold', badge.color)}>
        {t(badge.key)}
      </span>
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="rounded-full bg-muted px-3 py-1 text-sm">
          {t(`challenge_difficulty_${difficulty}`)}
        </span>
      </div>
    </m.div>
  );
}
