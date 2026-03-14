import { useTranslations } from 'next-intl';
import type { ArticulationGroup } from '../_lib/mock-data';
import { LetterItem } from './letter-item';

interface LetterGridProps {
  group: ArticulationGroup;
}

export function LetterGrid({ group }: LetterGridProps) {
  const t = useTranslations('reference_letters_page');

  return (
    <li className="flex flex-col gap-3">
      <h3 className="font-bold">{t(group.titleKey)}</h3>
      <ul className="grid grid-cols-3 gap-2 max-[20rem]:grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4">
        {group.letters.map((letter) => (
          <LetterItem key={letter.id} letter={letter} />
        ))}
      </ul>
    </li>
  );
}
