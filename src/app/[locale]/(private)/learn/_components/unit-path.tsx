'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { NodeButton } from '@/components/common/node-button';

import type { CurriculumLesson, CurriculumUnit } from '../../_lib/curriculum';
import { LessonQuizDialog } from './lesson-quiz-dialog';
import { UnitHeader } from './unit-header';

interface UnitPathProps {
  unit: CurriculumUnit;
  topicSlug: string;
  /** i18n key for the parent section name, e.g. 'sections_page.sections.noble_quran.title' */
  topicTitleKey: string;
}

export function UnitPath({
  unit,
  topicSlug,
  topicTitleKey,
}: Readonly<UnitPathProps>) {
  const t = useTranslations();
  const [activeLessonOrder, setActiveLessonOrder] = useState<number | null>(
    null,
  );

  function handleClickLesson(lesson: CurriculumLesson, index: number) {
    if (lesson.status === 'locked') return;
    setActiveLessonOrder(index);
  }

  return (
    <div className="flex flex-col gap-3">
      <UnitHeader
        unit={unit}
        topicTitle={t(topicTitleKey)}
        topicSlug={topicSlug}
      />
      <div className="flex flex-col items-center gap-3 py-3">
        {unit.lessons.map((lesson, index) => {
          const patternIndex = index % 4;
          let offset: -1 | 0 | 1 = 0;
          if (patternIndex === 1) offset = 1;
          else if (patternIndex === 3) offset = -1;

          return (
            <NodeButton
              key={`${unit.slug}-${index}`}
              type={lesson.type}
              status={lesson.status ?? 'available'}
              letterSymbol={lesson.letterSymbol}
              offset={offset}
              startLabel={t('learn_page.start')}
              onClick={() => handleClickLesson(lesson, index)}
            />
          );
        })}
      </div>
      <div className="mx-auto flex items-center gap-3 text-muted-foreground">
        <div className="h-px w-16 bg-border" />
        <span className="text-center text-xs font-medium tracking-wider uppercase">
          {t(unit.descriptionKey)}
        </span>
        <div className="h-px w-16 bg-border" />
      </div>

      {activeLessonOrder !== null && (
        <LessonQuizDialog
          topicSlug={topicSlug}
          unitSlug={unit.slug}
          lessonOrder={activeLessonOrder}
          open
          onOpenChange={(open) => {
            if (!open) setActiveLessonOrder(null);
          }}
        />
      )}
    </div>
  );
}
