import { COLUMN_SORT_ORDER, TABLE_ARTICULATION_AREAS } from '@/lib/constants';
import { getSupabaseClient } from '@/lib/supabase';
import { transformRemoteArticulationAreas } from '@/models/articulation';
import { RemoteArticulationAreasSchema } from '@/schemas/articulation';

export async function getArticulationAreas() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from(TABLE_ARTICULATION_AREAS)
      .select('*')
      .order(COLUMN_SORT_ORDER);

    if (error) throw new Error(error.message);

    const remoteArticulationAreas = RemoteArticulationAreasSchema.parse(data);
    const articulationAreas = transformRemoteArticulationAreas(
      remoteArticulationAreas,
    );

    return articulationAreas;
  } catch (error) {
    // TODO: handle error
    console.error(error);

    return [];
  }
}
