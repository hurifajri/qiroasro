import { ChevronRightIcon, SearchIcon, UserPlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Link } from '@/i18n/navigation';

export function AddFriendsCard() {
  const t = useTranslations('global.private_layout.profile_sidebar');

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3 className="font-bold text-sm">{t('add_friends.title')}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-0">
          {/* Find friends */}
          <Item asChild>
            <Link href="/find-friends">
              <ItemMedia variant="icon">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <SearchIcon className="size-5 text-muted-foreground" />
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  <h4 className="font-semibold text-sm">
                    {t('add_friends.find')}
                  </h4>
                </ItemTitle>
              </ItemContent>
              <ItemContent className="shrink-0">
                <ChevronRightIcon className="size-5 text-muted-foreground" />
              </ItemContent>
            </Link>
          </Item>

          {/* Invite friends */}
          <Item asChild>
            <Link href="/invite-friends">
              <ItemMedia variant="icon">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <UserPlusIcon className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  <h4 className="font-semibold text-sm">
                    {t('add_friends.invite')}
                  </h4>
                </ItemTitle>
              </ItemContent>
              <ItemContent className="shrink-0">
                <ChevronRightIcon className="size-5 text-muted-foreground" />
              </ItemContent>
            </Link>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
