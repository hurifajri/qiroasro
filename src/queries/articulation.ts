import { queryOptions } from '@tanstack/react-query';
import { getArticulationAreas, getArticulationPoints } from '@/services/articulation';

const articulationAreasKey = {
  all: ['articulation-areas'],
  list: () => [...articulationAreasKey.all, 'list'],
};

export function getArticulationAreasOpt() {
  return queryOptions({
    queryKey: articulationAreasKey.list(),
    queryFn: () => getArticulationAreas(),
  });
}

const articulationPointsKey = {
  all: ['articulation-points'],
  list: () => [...articulationPointsKey.all, 'list'],
};

export function getArticulationPointsOpt() {
  return queryOptions({
    queryKey: articulationPointsKey.list(),
    queryFn: () => getArticulationPoints(),
  });
}
