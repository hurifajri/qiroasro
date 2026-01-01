import type { RemoteArticulationArea, RemoteArticulationPoint } from '@/schemas/articulation';

function transformRemoteArticulationArea(remoteArticulationArea: RemoteArticulationArea) {
  return {
    id: remoteArticulationArea.id,
    slug: remoteArticulationArea.slug,
    isMuhaqqaq: remoteArticulationArea.is_muhaqqaq,
    sortOrder: remoteArticulationArea.sort_order,
  };
}

export function transformRemoteArticulationAreas(
  remoteArticulationAreas: RemoteArticulationArea[],
) {
  return remoteArticulationAreas.map((area) => transformRemoteArticulationArea(area));
}

function transformRemoteArticulationPoint(remoteArticulationPoint: RemoteArticulationPoint) {
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
  return remoteArticulationPoints.map((point) => transformRemoteArticulationPoint(point));
}
