import {
  COLUMN_SORT_ORDER,
  TABLE_LETTER_ARTICULATIONS,
  TABLE_LETTER_TRAITS,
  TABLE_LETTERS,
} from '@/lib/constants';
import { getSupabaseClient } from '@/lib/supabase';
import {
  transformRemoteLetterArticulations,
  transformRemoteLetters,
  transformRemoteLetterTraits,
} from '@/models/letter';
import {
  type Letter,
  type LetterArticulation,
  type LetterTrait,
  RemoteLetterArticulationsSchema,
  RemoteLettersSchema,
  RemoteLetterTraitsSchema,
} from '@/schemas/letter';

export async function getLetters(): Promise<Letter[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from(TABLE_LETTERS).select('*').order(COLUMN_SORT_ORDER);

    if (error) throw new Error(error.message);

    const remoteLetters = RemoteLettersSchema.parse(data);
    const letters = transformRemoteLetters(remoteLetters);

    return letters;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch letters');
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

    const remoteLetterArticulations = RemoteLetterArticulationsSchema.parse(data);
    const letterArticulations = transformRemoteLetterArticulations(remoteLetterArticulations);

    return letterArticulations;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch letter articulations');
  }
}

export async function getLetterTraits(): Promise<LetterTrait[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from(TABLE_LETTER_TRAITS).select('*');

    if (error) throw new Error(error.message);

    const remoteLetterTraits = RemoteLetterTraitsSchema.parse(data);
    const letterTraits = transformRemoteLetterTraits(remoteLetterTraits);

    return letterTraits;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch letter traits');
  }
}
