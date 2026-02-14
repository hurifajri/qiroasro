import type { FriendSuggestion } from '../_schemas/profile';
import { FriendSuggestionsCard } from './friend-suggestions-card';

interface FriendSuggestionsItemProps {
  friend: FriendSuggestion;
}

export function FriendSuggestionsItem({ friend }: FriendSuggestionsItemProps) {
  return (
    <li>
      <FriendSuggestionsCard friend={friend} />
    </li>
  );
}
