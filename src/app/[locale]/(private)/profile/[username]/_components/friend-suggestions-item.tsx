import type { FriendSuggestion } from '../../../_schemas/user-profile';
import { FriendSuggestionsCard } from './friend-suggestions-card';

interface FriendSuggestionsItemProps {
  friend: FriendSuggestion;
}

export function FriendSuggestionsItem({
  friend,
}: Readonly<FriendSuggestionsItemProps>) {
  return (
    <li>
      <FriendSuggestionsCard friend={friend} />
    </li>
  );
}
