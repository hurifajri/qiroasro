import type { FriendSuggestion } from '../../../_schemas/user-profile';
import { FriendSuggestionsItem } from './friend-suggestions-item';

interface FriendSuggestionsGridProps {
  friends: FriendSuggestion[];
}

export function FriendSuggestionsGrid({ friends }: FriendSuggestionsGridProps) {
  return (
    <ul className="grid @md:grid-cols-3 grid-cols-1 gap-3">
      {friends.map((friend) => (
        <FriendSuggestionsItem key={friend.id} friend={friend} />
      ))}
    </ul>
  );
}
