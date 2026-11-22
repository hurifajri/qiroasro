import { queryOptions } from '@tanstack/react-query';

import {
  getSectionsWithProgress,
  getUnitsWithProgress,
} from '../_services/curriculum-progress';

export const curriculumKeys = {
  all: ['curriculum'] as const,
  sections: () => [...curriculumKeys.all, 'sections'] as const,
  units: (topicSlug: string) =>
    [...curriculumKeys.all, 'units', topicSlug] as const,
};

/**
 * Returns all sections with progress data for the current user.
 * Cached for 1 minute — progress updates are optimistic / mutation-driven.
 */
export function getSectionsWithProgressOpt() {
  return queryOptions({
    queryKey: curriculumKeys.sections(),
    queryFn: () => getSectionsWithProgress(),
    staleTime: 60 * 1000,
  });
}

/**
 * Returns units for a specific topic with per-unit progress.
 */
export function getUnitsWithProgressOpt(topicSlug: string) {
  return queryOptions({
    queryKey: curriculumKeys.units(topicSlug),
    queryFn: () => getUnitsWithProgress(topicSlug),
    staleTime: 60 * 1000,
    enabled: topicSlug.length > 0,
  });
}
