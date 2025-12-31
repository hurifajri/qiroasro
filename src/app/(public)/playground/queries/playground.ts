import { queryOptions } from '@tanstack/react-query';
import { getPlaygroundData } from '../services/playground';

const playgroundDataKey = {
  all: ['playground-data'],
  list: () => [...playgroundDataKey.all, 'list'],
};

export function getPlaygroundDataOpt() {
  return queryOptions({
    queryKey: playgroundDataKey.list(),
    queryFn: () => getPlaygroundData(),
  });
}
