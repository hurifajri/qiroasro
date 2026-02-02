import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { Lesson, Unit } from '../_schemas/learn';
import { UnitPath } from './unit-path';

interface LearningPathProps {
  units: Unit[];
  lessons: Lesson[];
  className?: string;
  onLessonClick?: (lesson: Lesson) => void;
}

/**
 * Main learning path component with zigzag lesson nodes.
 */
export function LearningPath({
  units,
  lessons,
  className,
  onLessonClick,
}: LearningPathProps) {
  const _t = useTranslations('learn_page');

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      {units.slice(0, 2).map((unit) => (
        <UnitPath
          key={unit.id}
          unit={unit}
          lessons={lessons.filter((l) => l.unitId === unit.id)}
          onLessonClick={onLessonClick}
        />
      ))}
    </div>
  );
}
