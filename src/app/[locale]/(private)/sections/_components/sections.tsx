'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { MOCK_SECTIONS } from '../_lib/mock-data';
import type { Section } from '../_schemas/sections';
import { SectionsList } from './section-list';

/**
 * Main Sections component - shows all curriculum sections with progress.
 */
export function Sections() {
  const t = useTranslations('sections_page');
  const router = useRouter();

  const handleContinue = useCallback(
    (section: Section) => {
      // Navigate to learning path (filtered by section)
      router.push(`/learn?section=${section.id}`);
    },
    [router],
  );

  const handleReview = useCallback(
    (section: Section) => {
      // Navigate to review/practice for completed section
      router.push(`/learn?section=${section.id}&mode=review`);
    },
    [router],
  );

  return (
    <>
      <h2 className="sr-only">{t('section_list_title')}</h2>
      <SectionsList
        sections={MOCK_SECTIONS}
        onContinue={handleContinue}
        onReview={handleReview}
      />
    </>
  );
}
