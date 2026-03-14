'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserAvatar } from '../../../_components/user-avatar';
import type { FriendSuggestion } from '../../../_schemas/user-profile';

interface FriendSuggestionsCardProps {
  friend: FriendSuggestion;
}

export function FriendSuggestionsCard({ friend }: FriendSuggestionsCardProps) {
  const t = useTranslations('profile_page.friend_suggestions');
  const [isFollowing, setIsFollowing] = useState(friend.isFollowing);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <Card size="sm" className="relative h-full">
      <CardContent className="flex h-full items-center gap-3 p-4 sm:flex-col sm:text-center">
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
            <p className="text-muted-foreground text-xs">
              {t('followed_by', { count: friend.mutualFriendsCount })}
            </p>
          )}

          {/* Follow button */}
          <Button
            size="sm"
            variant={isFollowing ? 'outline' : 'default'}
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
