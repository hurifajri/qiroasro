'use client';

import { motion } from 'framer-motion';
import { ClockIcon, FlameIcon, ZapIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { CHALLENGE_MODE_CONFIG, type ChallengeDifficulty } from '../schemas/quiz';

interface ChallengeDifficultySelectorProps {
  onSelect: (difficulty: ChallengeDifficulty) => void;
}

const DIFFICULTY_UI_CONFIG: Record<
  ChallengeDifficulty,
  { icon: typeof ClockIcon; color: string; bgColor: string }
> = {
  easy: { icon: ClockIcon, color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-950' },
  medium: { icon: ZapIcon, color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-950' },
  hard: { icon: FlameIcon, color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-950' },
};

export function ChallengeDifficultySelector({ onSelect }: ChallengeDifficultySelectorProps) {
  const t = useTranslations('playground_page.quiz');

  const difficulties: ChallengeDifficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="flex flex-col gap-3">
      {difficulties.map((difficulty, index) => {
        const uiConfig = DIFFICULTY_UI_CONFIG[difficulty];
        const modeConfig = CHALLENGE_MODE_CONFIG[difficulty];
        const Icon = uiConfig.icon;

        return (
          <motion.div
            key={difficulty}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              onClick={() => onSelect(difficulty)}
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
                {t('challenge_seconds_per_question', { seconds: modeConfig.timerDuration })}
              </span>
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}
