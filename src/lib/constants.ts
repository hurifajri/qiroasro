export const GLOBAL_STORE_KEY = 'qiroasro_global-store';

// Table name
export const TABLE_LETTERS = 'hij_letters';
export const TABLE_LETTER_ARTICULATIONS = 'hij_letter_articulations';
export const TABLE_LETTER_TRAITS = 'hij_letter_traits';
export const TABLE_ARTICULATION_AREAS = 'hij_articulation_areas';
export const TABLE_ARTICULATION_POINTS = 'hij_articulation_points';
export const TABLE_TRAITS = 'hij_traits';
export const TABLE_TRAIT_GROUPS = 'hij_trait_groups';

// Column name
export const COLUMN_SORT_ORDER = 'sort_order';

// Constant values
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
export const VIEW_MODES = ['all', 'articulation', 'trait', 'letter'] as const;
export const LAYOUT_MODES = ['radial', 'hierarchical'] as const;
export const HIERARCHY_DIRECTIONS = ['vertical', 'horizontal'] as const;
export const EDGE_SHAPES = ['default', 'straight', 'step', 'smoothstep'] as const;
