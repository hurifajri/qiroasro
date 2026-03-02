import { Fragment } from 'react';
import { Separator } from '@/components/ui/separator';
import type { PracticeSection } from '../_lib/mock-data';
import { PracticeList } from './practice-list';

interface PracticeListGroupProps {
  sections: PracticeSection[];
}

export function PracticeListGroup({ sections }: PracticeListGroupProps) {
  return (
    <ul className="flex flex-col gap-6">
      {sections.map((section, index) => (
        <Fragment key={section.id}>
          <PracticeList section={section} />
          {index !== sections.length - 1 && <Separator />}
        </Fragment>
      ))}
    </ul>
  );
}
