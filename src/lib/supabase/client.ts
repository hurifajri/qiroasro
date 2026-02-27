import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/env';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
