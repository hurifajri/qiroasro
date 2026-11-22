'use server';

import { parse } from 'valibot';

import { mvPlaygroundData } from '@/db/playground-schema';
import { db } from '@/lib/db';

import {
  type PlaygroundData,
  PlaygroundDataSchema,
} from '../_schemas/playground';

export async function getPlaygroundData(): Promise<PlaygroundData> {
  try {
    const result = await db
      .select({ data: mvPlaygroundData.data })
      .from(mvPlaygroundData);
    const data = result[0]?.data;

    return parse(PlaygroundDataSchema, data);
  } catch (error) {
    console.error('[getPlaygroundData] Error:', error);
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
