import { queryOptions } from '@tanstack/react-query';
import { getLetterArticulations, getLetters, getLetterTraits } from '@/services/letter';

const lettersKey = {
  all: ['letters'],
  list: () => [...lettersKey.all, 'list'],
};

export function getLettersOpt() {
  return queryOptions({
    queryKey: lettersKey.list(),
    queryFn: () => getLetters(),
  });
}

const letterArticulationsKey = {
  all: ['letter-articulations'],
  list: () => [...letterArticulationsKey.all, 'list'],
};

export function getLetterArticulationsOpt() {
  return queryOptions({
    queryKey: letterArticulationsKey.list(),
    queryFn: () => getLetterArticulations(),
  });
}

const letterTraitsKey = {
  all: ['letter-traits'],
  list: () => [...letterTraitsKey.all, 'list'],
};

export function getLetterTraitsOpt() {
  return queryOptions({
    queryKey: letterTraitsKey.list(),
    queryFn: () => getLetterTraits(),
  });
}
