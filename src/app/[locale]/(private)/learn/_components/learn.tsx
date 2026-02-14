'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { MOCK_LESSONS, MOCK_UNITS } from '../_lib/mock-data';
import type { Lesson, Unit } from '../_schemas/learn';
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
  const router = useRouter();

  function handleClickLesson(lesson: Lesson) {
    if (lesson.status === 'locked') return;

    // TODO: Navigate to lesson or open lesson modal
    console.log('Lesson clicked:', lesson);
  }

  function handleClickSection(unit: Unit) {
    // TODO: Navigate to section or open section modal
    console.log('Section clicked:', unit);
    router.push('/sections');
  }

  function handleClickGuidebook() {
    // TODO: Open guidebook modal
    console.log('Guidebook clicked');
  }

  return (
    <>
      <h2 className="sr-only">{t('section_unit_title')}</h2>
      <LearningPath
        units={MOCK_UNITS}
        lessons={MOCK_LESSONS}
        onClickLesson={handleClickLesson}
        onClickSection={handleClickSection}
        onClickGuidebook={handleClickGuidebook}
        className={className}
      />
    </>
  );
}
