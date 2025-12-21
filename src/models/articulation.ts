import type { RemoteArticulationArea } from '@/schemas/articulation';

function transformRemoteArticulationArea(
  remoteArticulationArea: RemoteArticulationArea,
) {
  return {
    id: remoteArticulationArea.id,
    slug: remoteArticulationArea.slug,
    sortOrder: remoteArticulationArea.sort_order,
  };
}

export function transformRemoteArticulationAreas(
  remoteArticulationAreas: RemoteArticulationArea[],
) {
  return remoteArticulationAreas.map((letter) =>
    transformRemoteArticulationArea(letter),
  );
}
