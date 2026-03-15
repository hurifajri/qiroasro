import type { ReferenceCategory } from '../_lib/reference';
import { ReferenceItem } from './reference-item';

interface ReferenceGridProps {
  categories: ReferenceCategory[];
}

export function ReferenceGrid({ categories }: ReferenceGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-2 max-[20rem]:grid-cols-1 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <ReferenceItem key={category.id} category={category} />
      ))}
    </ul>
  );
}
