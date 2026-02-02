'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { MOCK_LESSONS, MOCK_UNITS } from '../_lib/mock-data';
import type { Lesson } from '../_schemas/learn';
import { LearningPath } from './learning-path';

interface LearnProps {
  className?: string;
}

/**
 * Main Learn component - Duolingo-style learning path UI.
 * Layout shell is now handled by private layout.
 */
export function Learn({ className }: LearnProps) {
  const t = useTranslations('learn_page');

  const handleLessonClick = useCallback((lesson: Lesson) => {
    if (lesson.status === 'locked') return;

    // TODO: Navigate to lesson or open lesson modal
    console.log('Lesson clicked:', lesson);
  }, []);

  return (
    <>
      <h2 className="sr-only">{t('section_unit_title')}</h2>
      <LearningPath
        units={MOCK_UNITS}
        lessons={MOCK_LESSONS}
        onLessonClick={handleLessonClick}
        className={className}
      />
    </>
  );
}
