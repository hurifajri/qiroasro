import { AspectRatio } from '@/components/ui/aspect-ratio';

import type { Letter } from '../../../_schemas/reference';
import { LetterCard } from './letter-card';

interface LetterItemProps {
  letter: Letter;
}

export function LetterItem({ letter }: Readonly<LetterItemProps>) {
  return (
    <li>
      <AspectRatio ratio={1}>
        <LetterCard letter={letter} />
      </AspectRatio>
    </li>
  );
}
