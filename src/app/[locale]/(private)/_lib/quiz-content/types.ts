/**
 * Type definitions for authored quiz content.
 * Used by topics where questions are pre-authored (not generated from DB).
 */

export interface AuthoredAnswer {
  /** i18n key suffix, e.g. 'a1' → quiz_content.{topic}.{unit}.{question_key}.a1 */
  key: 'a1' | 'a2' | 'a3' | 'a4';
  isCorrect: boolean;
}

export interface AuthoredQuestion {
  /** i18n key suffix, e.g. 'q1' → quiz_content.{topic}.{unit}.q1.question */
  key: string;
  type: 'multiple_choice';
  answers: [AuthoredAnswer, AuthoredAnswer, AuthoredAnswer, AuthoredAnswer];
}

export interface AuthoredUnit {
  questions: AuthoredQuestion[];
}

export interface AuthoredQuizContent {
  /** Matches CurriculumTopic.slug */
  topicSlug: string;
  /** Key: CurriculumUnit.slug */
  units: Record<string, AuthoredUnit>;
}
