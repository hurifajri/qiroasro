'use client';

import { ItemGroup } from '@/components/ui/item';

import type { SectionWithProgress } from '../../_schemas/curriculum-progress';
import { SectionItem } from './section-item';

interface SectionsListProps {
  sections: SectionWithProgress[];
  onStart: (section: SectionWithProgress) => void;
  onContinue: (section: SectionWithProgress) => void;
  onReview: (section: SectionWithProgress) => void;
}

/**
 * Sections list with back button header.
 */
export function SectionsList({
  sections,
  onStart,
  onContinue,
  onReview,
}: Readonly<SectionsListProps>) {
  return (
    <ItemGroup className="grid grid-cols-1 gap-4 @6xl:grid-cols-2">
      {/* Section Cards */}
      {sections.map((section) => (
        <SectionItem
          key={section.slug}
          section={section}
          onStart={onStart}
          onContinue={onContinue}
          onReview={onReview}
        />
      ))}
    </ItemGroup>
  );
}
