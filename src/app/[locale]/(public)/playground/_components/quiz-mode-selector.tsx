'use client';

import * as m from 'motion/react-m';
import { useTranslations } from 'next-intl';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useQuizStore } from '../_providers/quiz';
import type { QuizMode, QuizType } from '../_schemas/quiz';

export function QuizModeSelector() {
  const t = useTranslations('playground_page.quiz');

  const setMode = useQuizStore((s) => s.setMode);
  const setType = useQuizStore((s) => s.setType);

  function handleSelect(mode: QuizMode, type?: QuizType) {
    // trackEvent('quiz_mode_selected', {
    //   locale,
    //   theme,
    //   mode,
    //   type: type || null,
    // });
    setMode(mode);
    if (type) setType(type);
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <Button
        onClick={() => handleSelect('practice', 'articulation_point')}
        variant="outline"
        className="h-20 w-full justify-start gap-6 px-6 text-lg font-bold uppercase"
      >
        <span className="text-5xl">🎯</span>
        {t('mode_articulation_point')}
      </Button>

      <Button
        onClick={() => handleSelect('practice', 'trait')}
        variant="outline"
        className="h-20 w-full justify-start gap-6 px-6 text-lg font-bold uppercase"
      >
        <span className="text-5xl">✨</span>
        {t('mode_trait')}
      </Button>

      {/* Challenge button with pulse animation */}
      <m.button
        onClick={() => handleSelect('challenge')}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'h-20 w-full justify-start gap-6 border-2 border-amber-400 bg-linear-to-r from-amber-50 to-yellow-50 px-6 text-lg font-bold uppercase hover:from-amber-100 hover:to-yellow-100 dark:from-amber-950 dark:to-yellow-950 dark:hover:from-amber-900 dark:hover:to-yellow-900',
        )}
        animate={{
          boxShadow: [
            '0 0 0 0 rgba(234, 179, 8, 0.4)',
            '0 0 0 10px rgba(234, 179, 8, 0)',
            '0 0 0 0 rgba(234, 179, 8, 0)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <m.span
          className="text-5xl"
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          🏆
        </m.span>
        {t('mode_challenge')}
      </m.button>
    </div>
  );
}
