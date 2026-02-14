import { PartyPopperIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { ActivityFeedItem } from '../_schemas/profile-sidebar';

interface ActivityFeedCardProps {
  items: ActivityFeedItem[];
}

export function ActivityFeedCard({ items }: ActivityFeedCardProps) {
  const t = useTranslations('global.private_layout.profile_sidebar');

  return (
    <Card>
      <CardHeader className="flex w-full items-center justify-between gap-2">
        <CardTitle>
          <h3 className="font-bold text-sm">{t('activity_feed.title')}</h3>
        </CardTitle>
        <CardAction>
          <Link
            href="/friend-updates"
            className={cn(buttonVariants({ variant: 'link' }), 'px-0')}
          >
            {t('activity_feed.view_all')}
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Activity items */}
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              {/* User info */}
              <div className="flex items-start gap-2">
                <Avatar className="size-10">
                  <AvatarImage src={item.avatarUrl} alt={item.userName} />
                  <AvatarFallback>
                    {item.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-semibold text-sm">
                      {item.userName}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {item.timeAgo}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {t(item.descriptionKey)}
                  </p>
                </div>
              </div>

              {/* Celebrate button + reactions */}
              <div className="flex items-center gap-2 pl-12">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 font-semibold text-xs"
                >
                  <PartyPopperIcon className="size-3.5" />
                  {t('activity_feed.celebrate')}
                </Button>
                <div className="flex items-center gap-1">
                  {item.reactionEmojis.map((emoji) => (
                    <span key={emoji} className="text-sm">
                      {emoji}
                    </span>
                  ))}
                  <span className="text-muted-foreground text-xs">
                    {item.reactionCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
