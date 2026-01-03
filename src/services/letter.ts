import {
  COLUMN_SORT_ORDER,
  TABLE_LETTER_ARTICULATIONS,
  TABLE_LETTER_TRAITS,
  TABLE_LETTERS,
} from '@/lib/constants';
import { fetchFromTable } from '@/lib/supabase';
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

export function getLetters(): Promise<Letter[]> {
  return fetchFromTable(
    TABLE_LETTERS,
    RemoteLettersSchema,
    transformRemoteLetters,
    COLUMN_SORT_ORDER,
  );
}

export function getLetterArticulations(): Promise<LetterArticulation[]> {
  return fetchFromTable(
    TABLE_LETTER_ARTICULATIONS,
    RemoteLetterArticulationsSchema,
    transformRemoteLetterArticulations,
    COLUMN_SORT_ORDER,
  );
}

export function getLetterTraits(): Promise<LetterTrait[]> {
  return fetchFromTable(TABLE_LETTER_TRAITS, RemoteLetterTraitsSchema, transformRemoteLetterTraits);
}
