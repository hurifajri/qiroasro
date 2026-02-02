import type { PracticeSection } from '../_lib/mock-data';
import { PracticeList } from './practice-list';

interface PracticeListGroupProps {
  sections: PracticeSection[];
}

export function PracticeListGroup({ sections }: PracticeListGroupProps) {
  return (
    <ul className="flex flex-col gap-3">
      {sections.map((section) => (
        <PracticeList key={section.id} section={section} />
      ))}
    </ul>
  );
}
