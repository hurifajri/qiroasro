import { StatList } from '../../_components/stat-list';
import { MOCK_USER_STATS } from '../../_lib/mock-data';

export default function CatchAllHeader() {
  return (
    <StatList
      stats={MOCK_USER_STATS}
      className="rounded-xl border bg-background/10 backdrop-blur-sm"
    />
  );
}
