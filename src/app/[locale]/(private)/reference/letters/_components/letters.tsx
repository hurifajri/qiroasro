'use client';

import { ZapIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import type { ArticulationGroup } from '../../../_schemas/reference';
import { LetterGridGroup } from './letter-grid-group';

interface LettersProps {
  groups: ArticulationGroup[];
  learnedCount: number;
  totalCount: number;
}

export function Letters({
  groups,
  learnedCount,
  totalCount,
}: Readonly<LettersProps>) {
  const t = useTranslations('reference_letters_page');

  function handleStartPractice() {
    console.log('Start practice');
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex flex-col text-center">
          <h2 className="text-lg font-bold">{t('title')}</h2>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>

        {/* Start button */}
        <Button size="lg" onClick={handleStartPractice}>
          {t('start')}
          <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-sm">
            <ZapIcon className="size-3" />
            +10 XP
          </span>
        </Button>

        {/* Progress indicator */}
        <p className="text-sm text-muted-foreground">
          {t('progress', { learned: learnedCount, total: totalCount })}
        </p>
      </div>

      {/* Letter grouped by articulation */}
      <LetterGridGroup groups={groups} />
    </div>
  );
}
