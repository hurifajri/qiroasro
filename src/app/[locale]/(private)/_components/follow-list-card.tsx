'use client';

import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/i18n/navigation';
import type { FollowEntry } from '../_schemas/profile-sidebar';

interface FollowListCardProps {
  following: FollowEntry[];
  followers: FollowEntry[];
  followingCount: number;
  followersCount: number;
}

export function FollowListCard({
  following,
  followers,
  followingCount,
  followersCount,
}: FollowListCardProps) {
  const t = useTranslations('global.private_layout.profile_sidebar');

  const renderFollowEntry = (entry: FollowEntry) => (
    <Item key={entry.id} asChild>
      <li className="px-0! py-0!">
        <ItemMedia variant="image">
          <Avatar className="size-10">
            <AvatarImage src={entry.avatarUrl} alt={entry.name} />
            <AvatarFallback>
              {entry.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>
            <h4 className="font-semibold text-sm">{entry.name}</h4>
          </ItemTitle>
          <ItemDescription className="text-muted-foreground text-xs">
            {entry.xp.toLocaleString()} XP
          </ItemDescription>
        </ItemContent>
      </li>
    </Item>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3 className="font-bold text-sm">{t('follow_list.title')}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="following">
          <TabsList variant="line" className="w-full">
            <TabsTrigger value="following" className="flex-1">
              {t('follow_list.following')}
            </TabsTrigger>
            <TabsTrigger value="followers" className="flex-1">
              {t('follow_list.followers')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="following" className="mt-4 flex flex-col gap-3">
            <ItemGroup className="gap-0">
              {following.map(renderFollowEntry)}
            </ItemGroup>
            {followingCount > following.length && (
              <Link
                href="/following"
                className="flex items-center justify-between font-semibold text-primary text-sm hover:underline"
              >
                {t('follow_list.view_more', {
                  count: followingCount - following.length,
                })}
              </Link>
            )}
          </TabsContent>

          <TabsContent value="followers" className="mt-4 flex flex-col gap-3">
            <ItemGroup className="gap-0">
              {followers.map(renderFollowEntry)}
            </ItemGroup>
            {followersCount > followers.length && (
              <Link
                href="/followers"
                className="flex items-center justify-between font-semibold text-primary text-sm hover:underline"
              >
                {t('follow_list.view_more', {
                  count: followersCount - followers.length,
                })}
              </Link>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
