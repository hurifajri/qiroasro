'use client';

import { useState } from 'react';
import { UserAvatar } from '@/components/common/user-avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { FriendSuggestion } from '../_schemas/profile';

interface FriendSuggestionsCardProps {
  friend: FriendSuggestion;
}

export function FriendSuggestionsCard({ friend }: FriendSuggestionsCardProps) {
  const [isFollowing, setIsFollowing] = useState(friend.isFollowing);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <Card size="sm" className="relative">
      <CardContent className="flex flex-col items-center gap-3 p-4 text-center">
        {/* Avatar */}
        <UserAvatar
          name={friend.displayName}
          colorCode={friend.avatarColorCode}
          className="size-16"
          textClassName="font-semibold text-2xl"
        />

        {/* Name */}
        <h3 className="line-clamp-1 font-semibold text-sm">
          {friend.displayName}
        </h3>

        {/* Mutual friends */}
        <p className="text-muted-foreground text-xs">
          Followed by {friend.mutualFriendsCount} friends
        </p>

        {/* Follow button */}
        <Button
          size="sm"
          variant={isFollowing ? 'outline' : 'default'}
          onClick={handleFollow}
          className="w-full font-semibold"
        >
          {isFollowing ? 'FOLLOWING' : 'FOLLOW'}
        </Button>
      </CardContent>
    </Card>
  );
}
