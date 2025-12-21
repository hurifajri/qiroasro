import {
  COLUMN_SORT_ORDER,
  TABLE_LETTER_ARTICULATIONS,
  TABLE_LETTERS,
} from '@/lib/constants';
import { getSupabaseClient } from '@/lib/supabase';
import {
  transformRemoteLetterArticulations,
  transformRemoteLetters,
} from '@/models/letter';
import {
  type Letter,
  type LetterArticulation,
  RemoteLetterArticulationsSchema,
  RemoteLettersSchema,
} from '@/schemas/letter';

export async function getLetters(): Promise<Letter[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from(TABLE_LETTERS)
      .select('*')
      .order(COLUMN_SORT_ORDER);

    if (error) throw new Error(error.message);

    const remoteLetters = RemoteLettersSchema.parse(data);
    const letters = transformRemoteLetters(remoteLetters);

    return letters;
  } catch (error) {
    // TODO: handle error
    console.error(error);

    return [];
  }
}

export async function getLetterArticulations(): Promise<LetterArticulation[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from(TABLE_LETTER_ARTICULATIONS)
      .select('*')
      .order(COLUMN_SORT_ORDER);

    if (error) throw new Error(error.message);

    const remoteLetterArticulations =
      RemoteLetterArticulationsSchema.parse(data);
    const letterArticulations = transformRemoteLetterArticulations(
      remoteLetterArticulations,
    );

    return letterArticulations;
  } catch (error) {
    // TODO: handle error
    console.error(error);

    return [];
  }
}
