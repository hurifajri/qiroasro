'use server';

import { parse } from 'valibot';
import { mvPlaygroundData } from '@/db/schema';
import { db } from '@/lib/db';
import { transformRemotePlaygroundData } from '../_models/playground';
import {
  type PlaygroundData,
  RemotePlaygroundDataSchema,
} from '../_schemas/playground';

export async function getPlaygroundData(): Promise<PlaygroundData> {
  try {
    const result = await db
      .select({ data: mvPlaygroundData.data })
      .from(mvPlaygroundData);
    const data = result[0]?.data;

    const remoteData = parse(RemotePlaygroundDataSchema, data);
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
