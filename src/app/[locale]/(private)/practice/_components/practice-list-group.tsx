import { Fragment } from 'react';

import type { PracticeMode, PracticeSection } from '../../_schemas/practice';
import { PracticeList } from './practice-list';

interface PracticeListGroupProps {
  sections: readonly PracticeSection[];
  onSelectMode: (mode: PracticeMode) => void;
}

export function PracticeListGroup({
  sections,
  onSelectMode,
}: Readonly<PracticeListGroupProps>) {
  return (
    <ul className="grid grid-cols-1 gap-6 @3xl:grid-cols-2 @5xl:grid-cols-3">
      {sections.map((section) => (
        <Fragment key={section.id}>
          <PracticeList section={section} onSelectMode={onSelectMode} />
        </Fragment>
      ))}
    </ul>
  );
}
