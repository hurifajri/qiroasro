import { Fragment } from 'react';

import type { PracticeSection } from '../_lib/mock-data';
import { PracticeList } from './practice-list';

interface PracticeListGroupProps {
  sections: PracticeSection[];
}

export function PracticeListGroup({
  sections,
}: Readonly<PracticeListGroupProps>) {
  return (
    <ul className="grid grid-cols-1 gap-6 @3xl:grid-cols-2 @5xl:grid-cols-3">
      {sections.map((section) => (
        <Fragment key={section.id}>
          <PracticeList section={section} />
        </Fragment>
      ))}
    </ul>
  );
}
