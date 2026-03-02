import type { FriendSuggestion } from '../_schemas/profile';
import { FriendSuggestionsItem } from './friend-suggestions-item';

interface FriendSuggestionsGridProps {
  friends: FriendSuggestion[];
}

export function FriendSuggestionsGrid({ friends }: FriendSuggestionsGridProps) {
  return (
    <ul className="grid grid-cols-3 gap-3">
      {friends.map((friend) => (
        <FriendSuggestionsItem key={friend.id} friend={friend} />
      ))}
    </ul>
  );
}
