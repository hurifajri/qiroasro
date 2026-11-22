import { AspectRatio } from '@/components/ui/aspect-ratio';

import type { CurriculumTopic } from '../../_lib/curriculum';
import { ReferenceCard } from './reference-card';

interface ReferenceItemProps {
  topic: CurriculumTopic;
}

export function ReferenceItem({ topic }: Readonly<ReferenceItemProps>) {
  return (
    <li>
      <AspectRatio ratio={1}>
        <ReferenceCard topic={topic} />
      </AspectRatio>
    </li>
  );
}
