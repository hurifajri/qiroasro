import type { RemoteLetter, RemoteLetterArticulation } from '@/schemas/letter';

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

function transformRemoteLetterArticulation(
  remoteLetterArticulation: RemoteLetterArticulation,
) {
  return {
    isPrimary: remoteLetterArticulation.is_primary,
    letterId: remoteLetterArticulation.letter_id,
    pointId: remoteLetterArticulation.point_id,
    sortOrder: remoteLetterArticulation.sort_order,
  };
}

export function transformRemoteLetterArticulations(
  remoteLetterArticulations: RemoteLetterArticulation[],
) {
  return remoteLetterArticulations.map((letterArticulation) =>
    transformRemoteLetterArticulation(letterArticulation),
  );
}
