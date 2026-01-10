import {
  COLUMN_SORT_ORDER,
  TABLE_TRAIT_GROUPS,
  TABLE_TRAITS,
} from '@/lib/constants';
import { fetchFromTable } from '@/lib/supabase';
import {
  transformRemoteTraitGroups,
  transformRemoteTraits,
} from '@/models/trait';
import {
  RemoteTraitGroupsSchema,
  RemoteTraitsSchema,
  type Trait,
  type TraitGroup,
} from '@/schemas/trait';

export function getTraits(): Promise<Trait[]> {
  return fetchFromTable(
    TABLE_TRAITS,
    RemoteTraitsSchema,
    transformRemoteTraits,
    COLUMN_SORT_ORDER,
  );
}

export function getTraitGroups(): Promise<TraitGroup[]> {
  return fetchFromTable(
    TABLE_TRAIT_GROUPS,
    RemoteTraitGroupsSchema,
    transformRemoteTraitGroups,
    COLUMN_SORT_ORDER,
  );
}
