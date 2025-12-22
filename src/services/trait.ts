import { COLUMN_SORT_ORDER, TABLE_TRAIT_GROUPS, TABLE_TRAITS } from '@/lib/constants';
import { getSupabaseClient } from '@/lib/supabase';
import { transformRemoteTraitGroups, transformRemoteTraits } from '@/models/trait';
import {
  RemoteTraitGroupsSchema,
  RemoteTraitsSchema,
  type Trait,
  type TraitGroup,
} from '@/schemas/trait';

export async function getTraits(): Promise<Trait[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from(TABLE_TRAITS).select('*').order(COLUMN_SORT_ORDER);

    if (error) throw new Error(error.message);

    const remoteTraits = RemoteTraitsSchema.parse(data);
    const traits = transformRemoteTraits(remoteTraits);

    return traits;
  } catch (error) {
    // TODO: handle error
    console.error(error);

    return [];
  }
}

export async function getTraitGroups(): Promise<TraitGroup[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from(TABLE_TRAIT_GROUPS)
      .select('*')
      .order(COLUMN_SORT_ORDER);

    if (error) throw new Error(error.message);

    const remoteTraitGroups = RemoteTraitGroupsSchema.parse(data);
    const traitGroups = transformRemoteTraitGroups(remoteTraitGroups);

    return traitGroups;
  } catch (error) {
    // TODO: handle error
    console.error(error);

    return [];
  }
}
