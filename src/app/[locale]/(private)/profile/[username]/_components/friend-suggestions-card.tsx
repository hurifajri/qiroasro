'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { UserAvatar } from '@/components/common/user-avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { FriendSuggestion } from '../_schemas/profile';

interface FriendSuggestionsCardProps {
  friend: FriendSuggestion;
}

export function FriendSuggestionsCard({ friend }: FriendSuggestionsCardProps) {
  const t = useTranslations('profile_page');
  const [isFollowing, setIsFollowing] = useState(friend.isFollowing);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <Card size="sm" className="relative h-full">
      <CardContent className="flex h-full flex-col items-center gap-3 p-4 text-center">
        {/* Avatar */}
        <UserAvatar
          name={friend.displayName}
          colorCode={friend.avatarColorCode}
          className="size-16"
          textClassName="font-semibold text-2xl"
        />

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
      </CardContent>
    </Card>
  );
}
