import type { Letter, LetterTafkhimType } from '../_schemas/letter';

/**
 * Gradient colors per letter tafkhim group, used with `bg-linear-to-br`.
 * - always_tafkhim: 7 isti'la letters (always thick)
 * - conditional: alif, lam, ra (thick or thin depending on context)
 * - always_tarqiq: remaining letters (always thin)
 */
export const LETTER_TAFKHIM_GRADIENT: Record<LetterTafkhimType, string> = {
  always_tafkhim: 'from-node-letter-tafkhim to-node-letter-tafkhim-dark',
  conditional: 'from-node-letter-conditional to-node-letter-conditional-dark',
  always_tarqiq: 'from-node-letter to-node-letter-dark',
};

/** The 29 root hijaiyyah letters (excludes waw/ya variant child nodes). */
export function getRootLetters(letters: Letter[]): Letter[] {
  return letters.filter((letter) => letter.parentLetterSlug === null);
}

/**
 * Letters that own articulation/trait relations. Root waw and ya only group
 * their maddiyyah / ghairu maddiyyah children, so they are excluded.
 */
export function getLeafLetters(letters: Letter[]): Letter[] {
  const parentSlugs = new Set(
    letters.flatMap((letter) =>
      letter.parentLetterSlug ? [letter.parentLetterSlug] : [],
    ),
  );
  return letters.filter((letter) => !parentSlugs.has(letter.slug));
}
