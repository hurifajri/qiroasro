// Query param keys
export const PARAM_VIEW = 'view';
export const PARAM_LAYOUT = 'layout';
export const PARAM_DIRECTION = 'direction';
export const PARAM_SHAPE = 'shape';
export const PARAM_LETTER = 'letter';

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
export const VIEW_MODES = ['letter', 'articulation', 'trait', 'all'] as const;
export const LAYOUT_MODES = ['hierarchical', 'radial'] as const;
export const HIERARCHY_DIRECTIONS = ['horizontal', 'vertical'] as const;
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
