/**
 * Letters organized by Makhraj (articulation point)
 */
export interface Letter {
  id: string;
  symbol: string;
  nameKey: string;
  exampleWordKey?: string;
  makhraj: string;
  status: 'locked' | 'available' | 'learned';
}

export interface ArticulationGroup {
  id: string;
  titleKey: string;
  letters: Letter[];
}

export const MAKHRAJ_GROUPS: ArticulationGroup[] = [
  {
    id: 'jauf',
    titleKey: 'makhraj.jauf',
    letters: [
      {
        id: 'alif-mad',
        symbol: 'ـَا',
        nameKey: 'letters.alif_mad',
        makhraj: 'jauf',
        status: 'learned',
      },
      {
        id: 'waw-mad',
        symbol: 'ـُو',
        nameKey: 'letters.waw_mad',
        makhraj: 'jauf',
        status: 'learned',
      },
      {
        id: 'ya-mad',
        symbol: 'ـِي',
        nameKey: 'letters.ya_mad',
        makhraj: 'jauf',
        status: 'learned',
      },
    ],
  },
  {
    id: 'halq',
    titleKey: 'makhraj.halq',
    letters: [
      {
        id: 'hamza',
        symbol: 'ء',
        nameKey: 'letters.hamza',
        makhraj: 'halq',
        status: 'learned',
      },
      {
        id: 'ha',
        symbol: 'ه',
        nameKey: 'letters.ha',
        makhraj: 'halq',
        status: 'learned',
      },
      {
        id: 'ain',
        symbol: 'ع',
        nameKey: 'letters.ain',
        makhraj: 'halq',
        status: 'available',
      },
      {
        id: 'ha-wasath',
        symbol: 'ح',
        nameKey: 'letters.ha_wasath',
        makhraj: 'halq',
        status: 'available',
      },
      {
        id: 'ghain',
        symbol: 'غ',
        nameKey: 'letters.ghain',
        makhraj: 'halq',
        status: 'locked',
      },
      {
        id: 'kha',
        symbol: 'خ',
        nameKey: 'letters.kha',
        makhraj: 'halq',
        status: 'locked',
      },
    ],
  },
  {
    id: 'lisan',
    titleKey: 'makhraj.lisan',
    letters: [
      {
        id: 'qaf',
        symbol: 'ق',
        nameKey: 'letters.qaf',
        makhraj: 'lisan',
        status: 'locked',
      },
      {
        id: 'kaf',
        symbol: 'ك',
        nameKey: 'letters.kaf',
        makhraj: 'lisan',
        status: 'locked',
      },
      {
        id: 'jim',
        symbol: 'ج',
        nameKey: 'letters.jim',
        makhraj: 'lisan',
        status: 'locked',
      },
      {
        id: 'shin',
        symbol: 'ش',
        nameKey: 'letters.shin',
        makhraj: 'lisan',
        status: 'locked',
      },
      {
        id: 'ya',
        symbol: 'ي',
        nameKey: 'letters.ya',
        makhraj: 'lisan',
        status: 'locked',
      },
      {
        id: 'dad',
        symbol: 'ض',
        nameKey: 'letters.dad',
        makhraj: 'lisan',
        status: 'locked',
      },
      {
        id: 'lam',
        symbol: 'ل',
        nameKey: 'letters.lam',
        makhraj: 'lisan',
        status: 'locked',
      },
      {
        id: 'nun',
        symbol: 'ن',
        nameKey: 'letters.nun',
        makhraj: 'lisan',
        status: 'locked',
      },
      {
        id: 'ra',
        symbol: 'ر',
        nameKey: 'letters.ra',
        makhraj: 'lisan',
        status: 'locked',
      },
      {
        id: 'ta',
        symbol: 'ت',
        nameKey: 'letters.ta',
        makhraj: 'lisan',
        status: 'locked',
      },
      {
        id: 'dal',
        symbol: 'د',
        nameKey: 'letters.dal',
        makhraj: 'lisan',
        status: 'locked',
      },
      {
        id: 'tha',
        symbol: 'ث',
        nameKey: 'letters.tha',
        makhraj: 'lisan',
        status: 'locked',
      },
      {
        id: 'dhal',
        symbol: 'ذ',
        nameKey: 'letters.dhal',
        makhraj: 'lisan',
        status: 'locked',
      },
      {
        id: 'sad',
        symbol: 'ص',
        nameKey: 'letters.sad',
        makhraj: 'lisan',
        status: 'locked',
      },
      {
        id: 'sin',
        symbol: 'س',
        nameKey: 'letters.sin',
        makhraj: 'lisan',
        status: 'locked',
      },
      {
        id: 'za',
        symbol: 'ز',
        nameKey: 'letters.za',
        makhraj: 'lisan',
        status: 'locked',
      },
      {
        id: 'ta_mafkhama',
        symbol: 'ط',
        nameKey: 'letters.ta_mafkhama',
        makhraj: 'lisan',
        status: 'locked',
      },
      {
        id: 'dha',
        symbol: 'ظ',
        nameKey: 'letters.dha',
        makhraj: 'lisan',
        status: 'locked',
      },
    ],
  },
  {
    id: 'shafatayn',
    titleKey: 'makhraj.shafatayn',
    letters: [
      {
        id: 'fa',
        symbol: 'ف',
        nameKey: 'letters.fa',
        makhraj: 'shafatayn',
        status: 'locked',
      },
      {
        id: 'ba',
        symbol: 'ب',
        nameKey: 'letters.ba',
        makhraj: 'shafatayn',
        status: 'locked',
      },
      {
        id: 'mim',
        symbol: 'م',
        nameKey: 'letters.mim',
        makhraj: 'shafatayn',
        status: 'locked',
      },
      {
        id: 'waw',
        symbol: 'و',
        nameKey: 'letters.waw',
        makhraj: 'shafatayn',
        status: 'locked',
      },
    ],
  },
  {
    id: 'khayshum',
    titleKey: 'makhraj.khayshum',
    letters: [
      {
        id: 'nun-ghunna',
        symbol: 'نّ',
        nameKey: 'letters.nun_ghunna',
        makhraj: 'khayshum',
        status: 'locked',
      },
      {
        id: 'mim-ghunna',
        symbol: 'مّ',
        nameKey: 'letters.mim_ghunna',
        makhraj: 'khayshum',
        status: 'locked',
      },
    ],
  },
];

/**
 * Get letters count by status
 */
export function getLettersStats() {
  const allLetters = MAKHRAJ_GROUPS.flatMap((g) => g.letters);
  return {
    total: allLetters.length,
    learned: allLetters.filter((l) => l.status === 'learned').length,
    available: allLetters.filter((l) => l.status === 'available').length,
    locked: allLetters.filter((l) => l.status === 'locked').length,
  };
}
