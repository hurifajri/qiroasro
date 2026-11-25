import { getUserProfileByUsername } from '@/features/user-profile/services/user-profile';

import { ActivityFeedCard } from '../../../_components/activity-feed-card';
import { AddFriendsCard } from '../../../_components/add-friends-card';
import { FollowListCard } from '../../../_components/follow-list-card';
import {
  getUserActivityFeed,
  getUserFollowers,
  getUserFollowing,
} from '../../../_services/social';

export default async function ProfileSidebar({
  params,
}: Readonly<{
  params: Promise<{ username: string }>;
}>) {
  const { username } = await params;
  const userProfile = await getUserProfileByUsername(username);

  const [activityFeed, following, followers] = userProfile
    ? await Promise.all([
        getUserActivityFeed(userProfile.id),
        getUserFollowing(userProfile.id),
        getUserFollowers(userProfile.id),
      ])
    : [[], [], []];

  const followingCount = userProfile?.followingCount ?? 0;
  const followersCount = userProfile?.followersCount ?? 0;

  return (
    <>
      <ActivityFeedCard items={activityFeed} />
      <FollowListCard
        following={following}
        followers={followers}
        followingCount={followingCount}
        followersCount={followersCount}
      />
      <AddFriendsCard />
    </>
  );
}
