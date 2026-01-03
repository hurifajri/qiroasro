import {
  COLUMN_SORT_ORDER,
  TABLE_ARTICULATION_AREAS,
  TABLE_ARTICULATION_POINTS,
} from '@/lib/constants';
import { fetchFromTable } from '@/lib/supabase';
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

export function getArticulationAreas(): Promise<ArticulationArea[]> {
  return fetchFromTable(
    TABLE_ARTICULATION_AREAS,
    RemoteArticulationAreasSchema,
    transformRemoteArticulationAreas,
    COLUMN_SORT_ORDER,
  );
}

export function getArticulationPoints(): Promise<ArticulationPoint[]> {
  return fetchFromTable(
    TABLE_ARTICULATION_POINTS,
    RemoteArticulationPointsSchema,
    transformRemoteArticulationPoints,
    COLUMN_SORT_ORDER,
  );
}
