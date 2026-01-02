'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import type { QuizMode } from '../schemas/quiz';

interface QuizModeSelectorProps {
  onSelect: (mode: QuizMode) => void;
  onChallengeSelect: () => void;
}

export function QuizModeSelector({ onSelect, onChallengeSelect }: QuizModeSelectorProps) {
  const t = useTranslations('playground_page.quiz');

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => onSelect('articulation_point')}
        variant="outline"
        className="h-20 text-lg"
      >
        <span className="text-2xl">🎯</span>
        {t('mode_articulation_point')}
      </Button>
      <Button onClick={() => onSelect('trait')} variant="outline" className="h-20 text-lg">
        <span className="text-2xl">✨</span>
        {t('mode_trait')}
      </Button>

      {/* Challenge button with pulse animation */}
      <motion.div
        animate={{
          boxShadow: [
            '0 0 0 0 rgba(234, 179, 8, 0.4)',
            '0 0 0 10px rgba(234, 179, 8, 0)',
            '0 0 0 0 rgba(234, 179, 8, 0)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="rounded-lg"
      >
        <Button
          onClick={onChallengeSelect}
          variant="outline"
          className="h-20 w-full border-2 border-amber-400 bg-linear-to-r from-amber-50 to-yellow-50 text-lg hover:from-amber-100 hover:to-yellow-100 dark:from-amber-950 dark:to-yellow-950 dark:hover:from-amber-900 dark:hover:to-yellow-900"
        >
          <motion.span
            className="text-2xl"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            🏅
          </motion.span>
          {t('mode_challenge')}
        </Button>
      </motion.div>
    </div>
  );
}
