import { AdsPlaceholder } from '../../_components/ads-placeholder';
import { QuestsCard } from '../../_components/quests-card';
import { getCurrentUserDailyQuests } from '../../_services/gamification';

export default async function ShopSidebar() {
  const quests = await getCurrentUserDailyQuests();

  return (
    <>
      <QuestsCard quests={quests} />
      <AdsPlaceholder />
    </>
  );
}
