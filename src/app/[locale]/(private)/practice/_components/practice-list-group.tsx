import { Fragment } from 'react';
import type { PracticeSection } from '../_lib/mock-data';
import { PracticeList } from './practice-list';

interface PracticeListGroupProps {
  sections: PracticeSection[];
}

export function PracticeListGroup({ sections }: PracticeListGroupProps) {
  return (
    <ul className="flex flex-col gap-6">
      {sections.map((section) => (
        <Fragment key={section.id}>
          <PracticeList section={section} />
        </Fragment>
      ))}
    </ul>
  );
}
