import { UserAvatar } from '@/components/common/user-avatar';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import type { FollowEntry } from '../_schemas/private';

interface FollowListRowProps {
  entry: FollowEntry;
}

export function FollowListRow({ entry }: FollowListRowProps) {
  return (
    <Item asChild>
      <li className="p-0!">
        <ItemMedia variant="image" className="translate-0! self-center!">
          <UserAvatar
            name={entry.name}
            colorCode={entry.avatarColorCode}
            size="lg"
            hasOnlineBadge
            isOnline={entry.isOnline}
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{entry.name}</ItemTitle>
          <ItemDescription>{entry.xp.toLocaleString()} XP</ItemDescription>
        </ItemContent>
      </li>
    </Item>
  );
}
