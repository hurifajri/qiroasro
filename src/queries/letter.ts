import { queryOptions } from '@tanstack/react-query';
import { getLetters } from '@/services/letter';

const letterKey = {
  all: ['letter'],
  list: () => [...letterKey.all, 'list'],
};

export function getLettersOpt() {
  return queryOptions({
    queryKey: letterKey.list(),
    queryFn: () => getLetters(),
  });
}
