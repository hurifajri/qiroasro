'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { PracticeMode, PracticeSection } from '../../_schemas/practice';
import { PracticeListGroup } from './practice-list-group';
import { PracticeSessionDialog } from './practice-session-dialog';

interface PracticeProps {
  sections: readonly PracticeSection[];
}

export function Practice({ sections }: Readonly<PracticeProps>) {
  const t = useTranslations('practice_page');
  const [selectedMode, setSelectedMode] = useState<PracticeMode | null>(null);

  return (
    <div className="@container flex flex-col gap-6">
      <div className="flex flex-col text-center">
        <h2 className="text-lg font-bold">{t('title')}</h2>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      {/* Sections */}
      <PracticeListGroup
        sections={sections}
        onSelectMode={(mode) => setSelectedMode(mode)}
      />

      <PracticeSessionDialog
        mode={selectedMode}
        open={selectedMode !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedMode(null);
        }}
      />
    </div>
  );
}
