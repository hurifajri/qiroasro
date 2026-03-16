import type { ReferenceCategory } from '../_lib/reference';
import { ReferenceItem } from './reference-item';

interface ReferenceGridProps {
  categories: ReferenceCategory[];
}

export function ReferenceGrid({ categories }: ReferenceGridProps) {
  return (
    <ul className="grid 3xl:grid-cols-5 4xl:grid-cols-6 5xl:grid-cols-7 grid-cols-2 gap-2 max-[20rem]:grid-cols-1 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {categories.map((category) => (
        <ReferenceItem key={category.id} category={category} />
      ))}
    </ul>
  );
}
