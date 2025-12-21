import type { RemoteLetter } from '@/schemas/letter';

function transformRemoteLetter(remoteLetter: RemoteLetter) {
  return {
    id: remoteLetter.id,
    slug: remoteLetter.slug,
    symbol: remoteLetter.symbol,
    isMadd: remoteLetter.is_madd,
    sortOrder: remoteLetter.sort_order,
  };
}

export function transformRemoteLetters(remoteLetters: RemoteLetter[]) {
  return remoteLetters.map((letter) => transformRemoteLetter(letter));
}
