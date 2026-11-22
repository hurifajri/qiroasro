import type { ArticulationGroup } from '../../../_schemas/reference';
import { LetterGrid } from './letter-grid';

interface LetterGridGroupProps {
  groups: ArticulationGroup[];
}

export function LetterGridGroup({ groups }: Readonly<LetterGridGroupProps>) {
  return (
    <ul className="flex flex-col gap-6">
      {groups.map((group) => (
        <LetterGrid key={group.id} group={group} />
      ))}
    </ul>
  );
}
