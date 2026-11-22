import { CURRICULUM_TOPICS } from '../../_lib/curriculum';
import { ReferenceItem } from './reference-item';

export function ReferenceGrid() {
  return (
    <ul className="grid grid-cols-2 gap-2 @max-xs:grid-cols-1 @lg:grid-cols-3 @2xl:grid-cols-4 @4xl:grid-cols-5 @5xl:grid-cols-6">
      {CURRICULUM_TOPICS.map((topic) => (
        <ReferenceItem key={topic.slug} topic={topic} />
      ))}
    </ul>
  );
}
