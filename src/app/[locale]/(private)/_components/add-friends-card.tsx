import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ItemGroup } from '@/components/ui/item';

import { ADD_FRIENDS_ITEMS } from '../_lib/mock-data';
import { AddFriendsRow } from './add-friends-row';

export function AddFriendsCard() {
  const t = useTranslations('global.private_layout');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('add_friends.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {ADD_FRIENDS_ITEMS.map((item) => (
            <AddFriendsRow
              key={item.id}
              href={item.href}
              iconName={item.iconName}
              iconBgClass={item.iconBgClass}
              iconClass={item.iconClass}
              labelKey={item.labelKey}
            />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
