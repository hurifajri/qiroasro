import type { AuthoredQuizContent } from './types';

/**
 * Authored quiz for topic: 'noble-quran'
 *
 * Questions are derived from the MDX content at:
 * reference/_contents/noble-quran/{locale}.mdx
 *
 * i18n keys live in: locales/{locale}/quiz.json
 * under: quiz_content.noble_quran.{unit_key}.{question_key}.{field}
 *
 * Note: underscores are used in JSON keys (noble_quran, quran_delivery_method)
 * but slugs use kebab-case for URLs.
 */
export const NOBLE_QURAN_QUIZ: AuthoredQuizContent = {
  topicSlug: 'noble-quran',
  units: {
    'quran-delivery-method': {
      questions: [
        {
          key: 'q1',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: true },
            { key: 'a2', isCorrect: false },
            { key: 'a3', isCorrect: false },
            { key: 'a4', isCorrect: false },
          ],
        },
        {
          key: 'q2',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: false },
            { key: 'a2', isCorrect: true },
            { key: 'a3', isCorrect: false },
            { key: 'a4', isCorrect: false },
          ],
        },
        {
          key: 'q3',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: false },
            { key: 'a2', isCorrect: false },
            { key: 'a3', isCorrect: true },
            { key: 'a4', isCorrect: false },
          ],
        },
        {
          key: 'q4',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: false },
            { key: 'a2', isCorrect: false },
            { key: 'a3', isCorrect: false },
            { key: 'a4', isCorrect: true },
          ],
        },
        {
          key: 'q5',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: true },
            { key: 'a2', isCorrect: false },
            { key: 'a3', isCorrect: false },
            { key: 'a4', isCorrect: false },
          ],
        },
      ],
    },
    'mutawatir-definition': {
      questions: [
        {
          key: 'q1',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: false },
            { key: 'a2', isCorrect: true },
            { key: 'a3', isCorrect: false },
            { key: 'a4', isCorrect: false },
          ],
        },
        {
          key: 'q2',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: true },
            { key: 'a2', isCorrect: false },
            { key: 'a3', isCorrect: false },
            { key: 'a4', isCorrect: false },
          ],
        },
        {
          key: 'q3',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: false },
            { key: 'a2', isCorrect: false },
            { key: 'a3', isCorrect: true },
            { key: 'a4', isCorrect: false },
          ],
        },
        {
          key: 'q4',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: false },
            { key: 'a2', isCorrect: false },
            { key: 'a3', isCorrect: false },
            { key: 'a4', isCorrect: true },
          ],
        },
        {
          key: 'q5',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: false },
            { key: 'a2', isCorrect: true },
            { key: 'a3', isCorrect: false },
            { key: 'a4', isCorrect: false },
          ],
        },
      ],
    },
    'oral-transmission-process': {
      questions: [
        {
          key: 'q1',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: false },
            { key: 'a2', isCorrect: false },
            { key: 'a3', isCorrect: true },
            { key: 'a4', isCorrect: false },
          ],
        },
        {
          key: 'q2',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: true },
            { key: 'a2', isCorrect: false },
            { key: 'a3', isCorrect: false },
            { key: 'a4', isCorrect: false },
          ],
        },
        {
          key: 'q3',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: false },
            { key: 'a2', isCorrect: true },
            { key: 'a3', isCorrect: false },
            { key: 'a4', isCorrect: false },
          ],
        },
        {
          key: 'q4',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: false },
            { key: 'a2', isCorrect: false },
            { key: 'a3', isCorrect: false },
            { key: 'a4', isCorrect: true },
          ],
        },
        {
          key: 'q5',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: true },
            { key: 'a2', isCorrect: false },
            { key: 'a3', isCorrect: false },
            { key: 'a4', isCorrect: false },
          ],
        },
      ],
    },
    'quran-codification': {
      questions: [
        {
          key: 'q1',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: false },
            { key: 'a2', isCorrect: false },
            { key: 'a3', isCorrect: true },
            { key: 'a4', isCorrect: false },
          ],
        },
        {
          key: 'q2',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: true },
            { key: 'a2', isCorrect: false },
            { key: 'a3', isCorrect: false },
            { key: 'a4', isCorrect: false },
          ],
        },
        {
          key: 'q3',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: false },
            { key: 'a2', isCorrect: false },
            { key: 'a3', isCorrect: false },
            { key: 'a4', isCorrect: true },
          ],
        },
        {
          key: 'q4',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: false },
            { key: 'a2', isCorrect: true },
            { key: 'a3', isCorrect: false },
            { key: 'a4', isCorrect: false },
          ],
        },
        {
          key: 'q5',
          type: 'multiple_choice',
          answers: [
            { key: 'a1', isCorrect: false },
            { key: 'a2', isCorrect: false },
            { key: 'a3', isCorrect: true },
            { key: 'a4', isCorrect: false },
          ],
        },
      ],
    },
  },
};
