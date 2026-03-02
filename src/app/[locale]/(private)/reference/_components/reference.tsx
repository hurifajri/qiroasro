'use client';

import { BookOpenIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReferenceCategory } from '../_lib/mock-data';
import { ReferenceGrid } from './reference-grid';

interface ReferenceProps {
  categories: ReferenceCategory[];
}

export function Reference({ categories }: ReferenceProps) {
  const t = useTranslations('reference_page');

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BookOpenIcon className="size-6 text-primary" />
        <h2 className="font-bold text-xl">{t('title')}</h2>
      </div>

      {/* Categories Grid */}
      <ReferenceGrid categories={categories} />
    </div>
  );
}
