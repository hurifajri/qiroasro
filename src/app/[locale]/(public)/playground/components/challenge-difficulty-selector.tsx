'use client';

import { ClockIcon, FlameIcon, ZapIcon } from 'lucide-react';
import * as m from 'motion/react-m';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useQuizStore } from '../providers/quiz';
import {
  CHALLENGE_QUIZ_LEVEL,
  type ChallengeQuizDifficulty,
} from '../schemas/quiz';

const DIFFICULTY_UI_CONFIG: Record<
  ChallengeQuizDifficulty,
  { icon: typeof ClockIcon; color: string; bgColor: string }
> = {
  easy: {
    icon: ClockIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950',
  },
  medium: {
    icon: ZapIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950',
  },
  hard: {
    icon: FlameIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950',
  },
};

export function ChallengeDifficultySelector() {
  const t = useTranslations('playground_page.quiz');

  const selectDifficulty = useQuizStore((s) => s.selectChallengeDifficulty);

  function handleSelectDifficulty(difficulty: ChallengeQuizDifficulty) {
    // trackEvent('challenge_difficulty_selected', { locale, theme, difficulty });
    selectDifficulty(difficulty);
  }

  const difficulties: ChallengeQuizDifficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="flex flex-col gap-3">
      {difficulties.map((difficulty, index) => {
        const uiConfig = DIFFICULTY_UI_CONFIG[difficulty];
        const modeConfig = CHALLENGE_QUIZ_LEVEL[difficulty];
        const Icon = uiConfig.icon;

        return (
          <m.div
            key={difficulty}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              onClick={() => handleSelectDifficulty(difficulty)}
              variant="outline"
              className={`h-auto w-full flex-col gap-1 py-4 ${uiConfig.bgColor}`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`size-5 ${uiConfig.color}`} />
                <span className="font-semibold text-lg">
                  {t(`challenge_difficulty_${difficulty}`)}
                </span>
              </div>
              <span className="text-muted-foreground text-sm">
                {t('challenge_seconds_per_question', {
                  seconds: modeConfig.timerDuration,
                })}
              </span>
            </Button>
          </m.div>
        );
      })}
    </div>
  );
}
