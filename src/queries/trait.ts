import { queryOptions } from '@tanstack/react-query';
import { getTraits } from '@/services/trait';

const traitsKey = {
  all: ['traits'],
  list: () => [...traitsKey.all, 'list'],
};

export function getTraitsOpt() {
  return queryOptions({
    queryKey: traitsKey.list(),
    queryFn: () => getTraits(),
  });
}
