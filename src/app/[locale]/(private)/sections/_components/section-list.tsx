'use client';

import { ItemGroup } from '@/components/ui/item';
import type { Section } from '../_schemas/sections';
import { SectionItem } from './section-item';

interface SectionsListProps {
  sections: Section[];
  onContinue: (section: Section) => void;
  onReview: (section: Section) => void;
}

/**
 * Sections list with back button header.
 */
export function SectionsList({
  sections,
  onContinue,
  onReview,
}: SectionsListProps) {
  return (
    <ItemGroup className="grid @3xl:grid-cols-2 @5xl:grid-cols-3 grid-cols-1 gap-4">
      {/* Section Cards */}
      {sections.map((section) => (
        <SectionItem
          key={section.id}
          section={section}
          onContinue={onContinue}
          onReview={onReview}
        />
      ))}
    </ItemGroup>
  );
}
