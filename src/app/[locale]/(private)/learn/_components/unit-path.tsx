import { useTranslations } from 'next-intl';
import type { CurriculumLesson, CurriculumUnit } from '../../_lib/curriculum';
import { LessonNode } from './lesson-node';
import { UnitHeader } from './unit-header';

interface UnitPathProps {
  unit: CurriculumUnit;
  topicSlug: string;
  /** i18n key for the parent section name, e.g. 'sections_page.sections.noble_quran.title' */
  topicTitleKey: string;
}

export function UnitPath({ unit, topicSlug, topicTitleKey }: UnitPathProps) {
  const t = useTranslations();

  function handleClickLesson(lesson: CurriculumLesson) {
    if (lesson.status === 'locked') return;
    // TODO: Navigate to lesson or open lesson modal
    console.log('Lesson clicked:', lesson);
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
            <LessonNode
              key={`${unit.slug}-${index}`}
              lesson={lesson}
              offset={offset}
              onClick={() => handleClickLesson(lesson)}
            />
          );
        })}
      </div>
      <div className="mx-auto flex items-center gap-3 text-muted-foreground">
        <div className="h-px w-16 bg-border" />
        <span className="text-center font-medium text-xs uppercase tracking-wider">
          {t(unit.descriptionKey)}
        </span>
        <div className="h-px w-16 bg-border" />
      </div>
    </div>
  );
}
