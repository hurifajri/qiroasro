import { queryOptions } from '@tanstack/react-query';

import {
  getAdaptivePracticeItems,
  getPracticeSections,
  getUnitQuizQuestions,
} from '../_services/practice';

export const practiceKeys = {
  all: ['practice'] as const,
  sections: () => [...practiceKeys.all, 'sections'] as const,
  adaptiveItems: (modeId: string) =>
    [...practiceKeys.all, 'adaptive-items', modeId] as const,
  unitQuiz: (topicSlug: string, unitSlug: string) =>
    [...practiceKeys.all, 'unit-quiz', topicSlug, unitSlug] as const,
};

export function getPracticeSectionsOpt() {
  return queryOptions({
    queryKey: practiceKeys.sections(),
    queryFn: () => getPracticeSections(),
    staleTime: 60 * 1000,
  });
}

export function getAdaptivePracticeItemsOpt(modeId: string) {
  return queryOptions({
    queryKey: practiceKeys.adaptiveItems(modeId),
    queryFn: () => getAdaptivePracticeItems(modeId),
    enabled: modeId.length > 0,
    staleTime: 30 * 1000,
  });
}

export function getUnitQuizQuestionsOpt(topicSlug: string, unitSlug: string) {
  return queryOptions({
    queryKey: practiceKeys.unitQuiz(topicSlug, unitSlug),
    queryFn: () => getUnitQuizQuestions(topicSlug, unitSlug),
    enabled: topicSlug.length > 0 && unitSlug.length > 0,
    staleTime: 60 * 1000,
  });
}
