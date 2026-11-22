import { getCurrentUserDailyQuests } from '@/features/gamification/services/gamification';

import { AdsPlaceholder } from '../../_components/ads-placeholder';
import { QuestsCard } from '../../_components/quests-card';

export default async function ShopSidebar() {
  const quests = await getCurrentUserDailyQuests();

  return (
    <>
      <QuestsCard quests={quests} />
      <AdsPlaceholder />
    </>
  );
}
