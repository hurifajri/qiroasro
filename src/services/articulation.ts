import {
  COLUMN_SORT_ORDER,
  TABLE_ARTICULATION_AREAS,
  TABLE_ARTICULATION_POINTS,
} from '@/lib/constants';
import { getSupabaseClient } from '@/lib/supabase';
import {
  transformRemoteArticulationAreas,
  transformRemoteArticulationPoints,
} from '@/models/articulation';
import {
  type ArticulationArea,
  type ArticulationPoint,
  RemoteArticulationAreasSchema,
  RemoteArticulationPointsSchema,
} from '@/schemas/articulation';

export async function getArticulationAreas(): Promise<ArticulationArea[]> {
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
export async function getArticulationPoints(): Promise<ArticulationPoint[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from(TABLE_ARTICULATION_POINTS)
      .select('*')
      .order(COLUMN_SORT_ORDER);

    if (error) throw new Error(error.message);

    const remoteArticulationPoints = RemoteArticulationPointsSchema.parse(data);
    const articulationPoints = transformRemoteArticulationPoints(
      remoteArticulationPoints,
    );

    return articulationPoints;
  } catch (error) {
    // TODO: handle error
    console.error(error);

    return [];
  }
}
