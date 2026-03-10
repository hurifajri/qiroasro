'use client';

import { useTranslations } from 'next-intl';
import type { PracticeSection } from '../_lib/mock-data';
import { PracticeListGroup } from './practice-list-group';

interface PracticeProps {
  sections: PracticeSection[];
}

export function Practice({ sections }: PracticeProps) {
  const t = useTranslations('practice_page');

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center">
        <h2 className="font-bold text-lg">{t('title')}</h2>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      {/* Sections */}
      <PracticeListGroup sections={sections} />
    </div>
  );
}
