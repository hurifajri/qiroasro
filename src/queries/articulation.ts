import { queryOptions } from '@tanstack/react-query';
import { getArticulationAreas } from '@/services/articulation';

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
