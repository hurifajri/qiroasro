import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import type { FollowEntry } from '../_schemas/profile-sidebar';

interface FollowListRowProps {
  entry: FollowEntry;
}

export function FollowListRow({ entry }: FollowListRowProps) {
  return (
    <Item asChild>
      <li className="p-0!">
        <ItemMedia variant="image" className="translate-0! self-center!">
          <Avatar size="lg">
            <AvatarImage src={entry.avatarUrl} alt={entry.name} />
            <AvatarFallback>
              {entry.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{entry.name}</ItemTitle>
          <ItemDescription>{entry.xp.toLocaleString()} XP</ItemDescription>
        </ItemContent>
      </li>
    </Item>
  );
}
