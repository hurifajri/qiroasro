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
];

export const VIEW_MODES = ['all', 'articulation', 'trait', 'letter'];
export const LAYOUT_MODES = ['radial', 'hierarchical'];
export const HIERARCHY_DIRECTIONS = ['vertical', 'horizontal'];
export const EDGE_SHAPES = ['default', 'straight', 'step', 'smoothstep'];

// TODO: refactor colors to use oklch
export const NODE_COLORS = {
  letter: {
    primary: '#F59E0B', // Gold/Amber - precious foundation
    secondary: '#FCD34D',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    madd: '#EF4444', // Red highlight for madd letters
  },
  articulation: {
    primary: '#0EA5E9', // Azure/Sky - breath flow
    secondary: '#38BDF8',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
  },
  trait: {
    primary: '#8B5CF6', // Amethyst/Purple - deep character
    secondary: '#A78BFA',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  },
} as const;
