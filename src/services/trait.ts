import { COLUMN_SORT_ORDER, TABLE_TRAITS } from '@/lib/constants';
import { getSupabaseClient } from '@/lib/supabase';
import { transformRemoteTraits } from '@/models/trait';
import { RemoteTraitsSchema } from '@/schemas/trait';

export async function getTraits() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from(TABLE_TRAITS)
      .select('*')
      .order(COLUMN_SORT_ORDER);

    if (error) throw new Error(error.message);

    const remoteTraits = RemoteTraitsSchema.parse(data);
    const traits = transformRemoteTraits(remoteTraits);

    return traits;
  } catch (error) {
    // TODO: handle error
    console.error(error);

    return [];
  }
}
