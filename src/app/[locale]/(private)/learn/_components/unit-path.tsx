import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { getSectionTitleKey } from '../_lib/mock-data';
import type { Lesson, Unit } from '../_schemas/learn';
import { LessonNode } from './lesson-node';
import { UnitHeader } from './unit-header';

interface UnitPathProps {
  unit: Unit;
  lessons: Lesson[];
  onLessonClick?: (lesson: Lesson) => void;
}

export function UnitPath({ unit, lessons, onLessonClick }: UnitPathProps) {
  const t = useTranslations('learn_page');

  const sectionTitle = t(getSectionTitleKey(unit.sectionNumber), {
    section: unit.sectionNumber,
    unit: unit.unitNumber,
  });

  // Calculate zigzag offsets
  const lessonWithOffsets = useMemo(() => {
    return lessons.map((lesson, index) => {
      // Create zigzag pattern: 0, 1, 0, -1, 0, 1, 0, -1, ...
      const patternIndex = index % 4;
      let offset: -1 | 0 | 1 = 0;

      if (patternIndex === 1) offset = 1;
      else if (patternIndex === 3) offset = -1;

      return { lesson, offset };
    });
  }, [lessons]);

  return (
    <div className="flex flex-col gap-4">
      {/* Unit Header */}
      <UnitHeader
        unit={unit}
        sectionTitle={sectionTitle}
        onGuidebookClick={() => {
          // TODO: Open guidebook modal
        }}
      />

      {/* Lesson Nodes - zigzag pattern */}
      <div className="flex flex-col items-center gap-4 py-4">
        {lessonWithOffsets.map(({ lesson, offset }) => (
          <LessonNode
            key={lesson.id}
            lesson={lesson}
            offset={offset}
            onClick={() => onLessonClick?.(lesson)}
          />
        ))}
      </div>

      {/* Section divider with next section title */}
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
