import { createClient } from '@supabase/supabase-js';
import type { z } from 'zod';
import { env } from '@/env';

export function getSupabaseClient() {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(url, key);
}

/**
 * Generic helper to fetch data from a Supabase table with schema validation and transformation.
 * Eliminates repeated fetch patterns across services.
 */
export async function fetchFromTable<Schema extends z.ZodType, Result>(
  table: string,
  schema: Schema,
  transform: (data: z.infer<Schema>) => Result,
  orderBy?: string,
): Promise<Result> {
  const supabase = getSupabaseClient();
  let query = supabase.from(table).select('*');
  if (orderBy) query = query.order(orderBy);

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  try {
    const parsed = schema.parse(data);
    return transform(parsed);
  } catch (parseError) {
    throw parseError instanceof Error ? parseError : new Error('Failed to parse data');
  }
}
