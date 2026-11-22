'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';

import { UserAvatar } from '@/components/common/user-avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { userProfileKeys } from '@/features/user-profile/queries/user-profile';
import type { FriendSuggestion } from '@/features/user-profile/schemas/user-profile';
import { useRouter } from '@/i18n/navigation';

import { socialKeys } from '../../../_queries/social';
import { toggleFollowUser } from '../../../_services/social';

interface FriendSuggestionsCardProps {
  friend: FriendSuggestion;
}

export function FriendSuggestionsCard({
  friend,
}: Readonly<FriendSuggestionsCardProps>) {
  const t = useTranslations('profile_page.friend_suggestions');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState(friend.isFollowing);
  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    const previous = isFollowing;
    setIsFollowing(!previous);

    startTransition(async () => {
      const result = await toggleFollowUser({ targetUserId: friend.id });
      if (result.ok) {
        setIsFollowing(result.isFollowing);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: userProfileKeys.all }),
          queryClient.invalidateQueries({ queryKey: socialKeys.all }),
        ]);
        router.refresh();
      } else {
        setIsFollowing(previous);
      }
    });
  };

  return (
    <Card size="sm" className="relative h-full">
      <CardContent className="flex h-full items-center gap-3 p-4 @md:flex-col @md:text-center">
        {/* Avatar */}
        <UserAvatar
          name={friend.displayName}
          colorCode={friend.avatarColorCode}
          className="size-16"
          textClassName="font-semibold text-2xl"
        />

        <div className="flex h-full flex-col gap-1">
          {/* Name */}
          <h3 className="line-clamp-1 font-semibold">{friend.displayName}</h3>

          {/* Mutual friends */}
          {friend.mutualFriendsCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {t('followed_by', { count: friend.mutualFriendsCount })}
            </p>
          )}

          {/* Follow button */}
          <Button
            size="sm"
            variant={isFollowing ? 'outline' : 'default'}
            disabled={isPending}
            onClick={handleFollow}
            className="mt-auto w-full font-semibold uppercase"
          >
            {isFollowing ? t('following') : t('follow')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
