import { queryOptions } from '@tanstack/react-query';
import { getTraitGroups, getTraits } from '@/services/trait';

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

const traitGroupsKey = {
  all: ['trait-groups'],
  list: () => [...traitGroupsKey.all, 'list'],
};

export function getTraitGroupsOpt() {
  return queryOptions({
    queryKey: traitGroupsKey.list(),
    queryFn: () => getTraitGroups(),
  });
}
