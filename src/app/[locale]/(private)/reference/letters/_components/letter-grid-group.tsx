import type { ArticulationGroup } from '../_lib/mock-data';
import { LetterGrid } from './letter-grid';

interface LetterGridGroupProps {
  groups: ArticulationGroup[];
}

export function LetterGridGroup({ groups }: LetterGridGroupProps) {
  return (
    <ul className="flex flex-col gap-12">
      {groups.map((group) => (
        <LetterGrid key={group.id} group={group} />
      ))}
    </ul>
  );
}
