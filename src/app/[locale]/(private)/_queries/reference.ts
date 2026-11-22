import { queryOptions } from '@tanstack/react-query';

import {
  getLettersDirectoryData,
  getTajwidReferenceData,
  getTopicReferenceDetails,
} from '../_services/reference';

export const referenceKeys = {
  all: ['reference'] as const,
  lettersDirectory: () => [...referenceKeys.all, 'letters-directory'] as const,
  tajwidData: () => [...referenceKeys.all, 'tajwid-data'] as const,
  topicDetails: (topicSlug: string) =>
    [...referenceKeys.all, 'topic-details', topicSlug] as const,
};

export function getLettersDirectoryDataOpt() {
  return queryOptions({
    queryKey: referenceKeys.lettersDirectory(),
    queryFn: () => getLettersDirectoryData(),
    staleTime: 5 * 60 * 1000,
  });
}

export function getTajwidReferenceDataOpt() {
  return queryOptions({
    queryKey: referenceKeys.tajwidData(),
    queryFn: () => getTajwidReferenceData(),
    staleTime: 5 * 60 * 1000,
  });
}

export function getTopicReferenceDetailsOpt(topicSlug: string) {
  return queryOptions({
    queryKey: referenceKeys.topicDetails(topicSlug),
    queryFn: () => getTopicReferenceDetails(topicSlug),
    staleTime: 5 * 60 * 1000,
    enabled: topicSlug.length > 0,
  });
}
