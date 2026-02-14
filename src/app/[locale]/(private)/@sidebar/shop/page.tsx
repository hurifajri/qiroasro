import { AdsPlaceholder } from '../../_components/ads-placeholder';
import { QuestsCard } from '../../_components/quests-card';
import { MOCK_QUESTS } from '../../_lib/mock-data';

export default function ShopSidebar() {
  return (
    <>
      <QuestsCard quests={MOCK_QUESTS} />
      <AdsPlaceholder />
    </>
  );
}
