import { ActivityFeedCard } from '../../../_components/activity-feed-card';
import { AddFriendsCard } from '../../../_components/add-friends-card';
import { FollowListCard } from '../../../_components/follow-list-card';
import {
  MOCK_ACTIVITY_FEED,
  MOCK_FOLLOWERS,
  MOCK_FOLLOWING,
} from '../../../_lib/profile-sidebar-data';

export default async function ProfileSidebar({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  // Get username from params (for future use)
  await params;

  // Mock counts (in real app, fetch from API)
  const followingCount = 19;
  const followersCount = 52;

  return (
    <>
      <ActivityFeedCard items={MOCK_ACTIVITY_FEED} />
      <FollowListCard
        following={MOCK_FOLLOWING}
        followers={MOCK_FOLLOWERS}
        followingCount={followingCount}
        followersCount={followersCount}
      />
      <AddFriendsCard />
    </>
  );
}
