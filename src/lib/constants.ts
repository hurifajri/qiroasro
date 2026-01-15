// Store keys
export const GLOBAL_STORE_KEY = 'qiroasro_global-store';

export const LOCALES = [
  'id',
  'en',
  'tr',
  // 'ms',
  // 'fr',
  // 'es',
  // 'de',
  // 'nl',
  // 'it',
  // 'pt',
  // 'ru',
  // 'sw',
  // 'ar',
  // 'so',
  // 'ha',
  // 'ur',
  // 'fa',
  // 'bn',
  // 'zh',
  // 'hi',
  // 'ko',
] as const;
export const PAGES = ['/', '/playground'] as const;

// Nodes
export const LETTERS = [
  'ء',
  'ب',
  'ت',
  'ث',
  'ج',
  'ح',
  'خ',
  'د',
  'ذ',
  'ر',
  'ز',
  'س',
  'ش',
  'ص',
  'ض',
  'ط',
  'ظ',
  'ع',
  'غ',
  'ف',
  'ق',
  'ك',
  'ل',
  'م',
  'ن',
  'و',
  'ه',
  'لا',
  'ي',
  'ـَا',
  'ـُو',
  'ـِي',
] as const;

export const NODE_TYPES = [
  'letter',
  'articulation_area',
  'articulation_point',
  'trait_group',
  'trait',
] as const;

// Playground
export const VIEW_MODES = ['all', 'articulation', 'trait', 'letter'] as const;
export const LAYOUT_MODES = ['radial', 'hierarchical'] as const;
export const HIERARCHY_DIRECTIONS = ['vertical', 'horizontal'] as const;
export const EDGE_SHAPES = [
  'default',
  'straight',
  'step',
  'smoothstep',
] as const;

// Quiz
export const CORRECT_POINT = 10;
export const INCORRECT_POINT = -1;
export const QUIZ_MODES = ['practice', 'challenge'] as const;
export const QUIZ_STATUSES = ['none', 'correct', 'incorrect'] as const;
export const QUIZ_ERROR_TYPES = ['incorrect', 'missed'] as const;
export const CHALLENGE_QUIZ_DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
