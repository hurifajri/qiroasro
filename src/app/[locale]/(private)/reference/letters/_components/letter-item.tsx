import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { Letter } from '../_lib/mock-data';
import { LetterCard } from './letter-card';

interface LetterItemProps {
  letter: Letter;
}

export function LetterItem({ letter }: LetterItemProps) {
  return (
    <li>
      <AspectRatio ratio={1 / 1}>
        <LetterCard letter={letter} />
      </AspectRatio>
    </li>
  );
}
