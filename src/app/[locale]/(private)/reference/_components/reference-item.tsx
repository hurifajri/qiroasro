import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { ReferenceCategory } from '../_lib/mock-data';
import { ReferenceCard } from './reference-card';

interface ReferenceItemProps {
  category: ReferenceCategory;
}

export function ReferenceItem({ category }: ReferenceItemProps) {
  return (
    <li>
      <AspectRatio ratio={1 / 1}>
        <ReferenceCard category={category} />
      </AspectRatio>
    </li>
  );
}
