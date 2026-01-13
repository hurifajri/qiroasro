import { parse } from 'valibot';
import { MV_PLAYGROUND_DATA } from '@/lib/constants';
import { getSupabaseClient } from '@/lib/supabase';
import { transformRemotePlaygroundData } from '../models/playground';
import {
  type PlaygroundData,
  RemotePlaygroundDataSchema,
} from '../schemas/playground';

export async function getPlaygroundData(): Promise<PlaygroundData> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from(MV_PLAYGROUND_DATA)
      .select('data')
      .single();

    if (error) throw new Error(error.message);

    const remoteData = parse(RemotePlaygroundDataSchema, data?.data);
    const playgroundData = transformRemotePlaygroundData(remoteData);

    return playgroundData;
  } catch {
    return {
      letters: [],
      articulationAreas: [],
      articulationPoints: [],
      traitGroups: [],
      traits: [],
      letterArticulations: [],
      letterTraits: [],
    };
  }
}
