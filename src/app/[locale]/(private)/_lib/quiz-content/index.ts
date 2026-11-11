import { NOBLE_QURAN_QUIZ } from './noble-quran';
import type { AuthoredQuizContent } from './types';

/**
 * Registry mapping topic slugs to their authored quiz content.
 * Add new entries here as more topics get authored questions.
 */
const QUIZ_REGISTRY: Record<string, AuthoredQuizContent> = {
  'noble-quran': NOBLE_QURAN_QUIZ,
};

/**
 * Returns the authored quiz content for a given topic slug.
 * Returns undefined for relational quiz topics (not authored).
 */
export function getAuthoredQuiz(
  topicSlug: string,
): AuthoredQuizContent | undefined {
  return QUIZ_REGISTRY[topicSlug];
}

export type { AuthoredQuizContent } from './types';
