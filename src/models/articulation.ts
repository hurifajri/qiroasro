import type {
  RemoteArticulationArea,
  RemoteArticulationPoint,
} from '@/schemas/articulation';

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

function transformRemoteArticulationPoint(
  remoteArticulationPoint: RemoteArticulationPoint,
) {
  return {
    id: remoteArticulationPoint.id,
    areaId: remoteArticulationPoint.area_id,
    slug: remoteArticulationPoint.slug,
    sortOrder: remoteArticulationPoint.sort_order,
  };
}

export function transformRemoteArticulationPoints(
  remoteArticulationPoints: RemoteArticulationPoint[],
) {
  return remoteArticulationPoints.map((letter) =>
    transformRemoteArticulationPoint(letter),
  );
}
