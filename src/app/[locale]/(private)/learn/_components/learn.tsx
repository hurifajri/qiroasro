'use client';

import { useSearchParams } from 'next/navigation';

import { CURRICULUM_TOPICS } from '../../_lib/curriculum';
import { UnitPath } from './unit-path';

/**
 * Main Learn component with zigzag lesson nodes.
 *
 * Uses CURRICULUM_TOPICS as the source of truth for units and lessons.
 * The active topic is determined by the `section` URL search param (topic slug).
 * Defaults to the first topic in CURRICULUM_TOPICS if no param is provided.
 */
export function Learn() {
  const searchParams = useSearchParams();

  // Determine active topic — fall back to first topic
  const sectionSlug = searchParams.get('section');
  const defaultTopic = CURRICULUM_TOPICS[0];
  const currentTopic = CURRICULUM_TOPICS.find((t) => t.slug === sectionSlug);
  const topic = currentTopic ?? defaultTopic;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {topic.units.map((unit) => (
        <UnitPath
          key={unit.slug}
          unit={unit}
          topicSlug={topic.slug}
          topicTitleKey={topic.titleKey}
        />
      ))}
    </div>
  );
}
