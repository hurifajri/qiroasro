import type { Lesson, Unit } from '../_schemas/learn';
import { UnitPath } from './unit-path';

interface LearningPathProps {
  units: Unit[];
  lessons: Lesson[];
  onClickLesson: (lesson: Lesson) => void;
  onClickSection: (unit: Unit) => void;
  onClickGuidebook: () => void;
}

/**
 * Main learning path component with zigzag lesson nodes.
 */
export function LearningPath({
  units,
  lessons,
  onClickLesson,
  onClickSection,
  onClickGuidebook,
}: LearningPathProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {units.slice(0, 2).map((unit) => (
        <UnitPath
          key={unit.id}
          unit={unit}
          lessons={lessons.filter((l) => l.unitId === unit.id)}
          onClickLesson={onClickLesson}
          onClickSection={onClickSection}
          onClickGuidebook={onClickGuidebook}
        />
      ))}
    </div>
  );
}
