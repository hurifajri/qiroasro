import { createClient } from '@supabase/supabase-js';
import { env } from '@/env';

export function getSupabaseClient() {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(url, key);
}
