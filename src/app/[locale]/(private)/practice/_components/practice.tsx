'use client';

import { useTranslations } from 'next-intl';

import type { PracticeSection } from '../_lib/mock-data';
import { PracticeListGroup } from './practice-list-group';

interface PracticeProps {
  sections: PracticeSection[];
}

export function Practice({ sections }: Readonly<PracticeProps>) {
  const t = useTranslations('practice_page');

  return (
    <div className="@container flex flex-col gap-6">
      <div className="flex flex-col text-center">
        <h2 className="text-lg font-bold">{t('title')}</h2>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      {/* Sections */}
      <PracticeListGroup sections={sections} />
    </div>
  );
}
