import type { CardColorCode } from '@/lib/colors';

export type CourseStatus = 'completed' | 'in-progress' | 'available' | 'locked';

export interface SectionWithProgress {
  /** Matches CURRICULUM_TOPICS[n].slug */
  slug: string;
  sortOrder: number;
  titleKey: string;
  descriptionKey: string;
  iconSymbol: string;
  totalUnits: number;
  completedUnits: number;
  /** 0–100 */
  progress: number;
  /** Derived from progress + unit progress data */
  status: CourseStatus;
}

export interface UnitWithProgress {
  slug: string;
  sortOrder: number;
  titleKey: string;
  descriptionKey: string;
  colorCode: CardColorCode;
  iconKey: string;
  isCompleted: boolean;
  /** 0-based lessons completed count */
  completedLessons: number;
  totalLessons: number;
}
