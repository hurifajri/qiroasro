'use client';

import { BookOpenIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ReferenceGrid } from './reference-grid';

export function Reference() {
  const t = useTranslations('reference_page');

  return (
    <div className="@container flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <BookOpenIcon className="size-6 text-primary" />
        <h2 className="text-lg font-bold">{t('title')}</h2>
      </div>

      {/* Categories Grid */}
      <ReferenceGrid />
    </div>
  );
}
