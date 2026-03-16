import type { ReferenceCategory } from '../_lib/reference';
import { ReferenceItem } from './reference-item';

interface ReferenceGridProps {
  categories: ReferenceCategory[];
}

export function ReferenceGrid({ categories }: ReferenceGridProps) {
  return (
    <ul className="grid @2xl:grid-cols-4 @4xl:grid-cols-5 @5xl:grid-cols-6 @lg:grid-cols-3 @max-xs:grid-cols-1 grid-cols-2 gap-2">
      {categories.map((category) => (
        <ReferenceItem key={category.id} category={category} />
      ))}
    </ul>
  );
}
