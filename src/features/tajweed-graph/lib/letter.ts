import type { Letter } from '../schemas/letter';

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
