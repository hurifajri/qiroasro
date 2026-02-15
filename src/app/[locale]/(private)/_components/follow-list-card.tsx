'use client';

import { useTranslations } from 'next-intl';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ItemGroup } from '@/components/ui/item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { FollowEntry } from '../_schemas/private';
import { FollowListRow } from './follow-list-row';

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
  const t = useTranslations('global.private_layout');

  return (
    <Card>
      <CardContent>
        <Tabs defaultValue="following" className="gap-4">
          <TabsList variant="line" className="w-full">
            <TabsTrigger value="following">
              {t('follow_list.following')}
            </TabsTrigger>
            <TabsTrigger value="followers">
              {t('follow_list.followers')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="following" className="flex flex-col gap-2">
            <ItemGroup>
              {following.map((entry) => (
                <FollowListRow key={entry.id} entry={entry} />
              ))}
            </ItemGroup>
            {followingCount > following.length && (
              <Link
                href="/following"
                className={cn(
                  buttonVariants({ variant: 'link' }),
                  'w-fit px-0',
                )}
              >
                {t('follow_list.view_more', {
                  count: followingCount - following.length,
                })}
              </Link>
            )}
          </TabsContent>

          <TabsContent value="followers" className="flex flex-col gap-2">
            <ItemGroup>
              {followers.map((entry) => (
                <FollowListRow key={entry.id} entry={entry} />
              ))}
            </ItemGroup>
            {followersCount > followers.length && (
              <Link
                href="/followers"
                className={cn(
                  buttonVariants({ variant: 'link' }),
                  'w-fit px-0',
                )}
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
