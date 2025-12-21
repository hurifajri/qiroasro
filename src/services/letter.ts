import { COLUMN_SORT_ORDER, TABLE_LETTERS } from '@/lib/constants';
import { getSupabaseClient } from '@/lib/supabase';
import { transformRemoteLetters } from '@/models/letter';
import { type Letter, RemoteLettersSchema } from '@/schemas/letter';

export async function getLetters(): Promise<Letter[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE_LETTERS)
    .select('*')
    .order(COLUMN_SORT_ORDER);

  if (error) throw new Error(error.message);

  const remoteLetters = RemoteLettersSchema.parse(data);
  const letters = transformRemoteLetters(remoteLetters);

  return letters;
}
