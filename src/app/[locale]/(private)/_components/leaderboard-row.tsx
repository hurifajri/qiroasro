import { CrownIcon } from 'lucide-react';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from '../_schemas/private';

interface LeaderboardRowProps {
  entry: LeaderboardEntry & {
    /** Optional custom avatar background (Tailwind classes) */
    avatarBg?: string;
  };
}

export function LeaderboardRow({ entry }: LeaderboardRowProps) {
  const { rank, name, xp, isCurrentUser, avatarBg } = entry;

  // Medal colors for top 3
  const getMedalStyle = () => {
    switch (rank) {
      case 1:
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 2:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
      case 3:
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Item variant={isCurrentUser ? 'muted' : 'default'} asChild>
      <li
        className={cn(isCurrentUser && 'bg-primary/10 ring-1 ring-primary/20')}
      >
        {/* Rank */}
        <ItemMedia
          variant="icon"
          className={cn(
            'translate-0! self-center! flex size-8 shrink-0 items-center justify-center rounded-full font-bold text-sm',
            getMedalStyle(),
          )}
        >
          {rank === 1 ? <CrownIcon className="size-4" /> : rank}
        </ItemMedia>

        {/* Avatar */}
        <ItemMedia
          variant="image"
          className={cn(
            'translate-0! self-center! flex size-10 shrink-0 items-center justify-center rounded-full font-bold text-white',
            avatarBg || 'bg-linear-to-br from-primary/60 to-primary text-xs',
          )}
        >
          {name.charAt(0).toUpperCase()}
        </ItemMedia>

        {/* Name */}
        <ItemContent>
          <ItemTitle>
            <h4
              className={cn(
                'flex-1 truncate font-medium text-sm',
                isCurrentUser && 'font-bold text-primary',
              )}
            >
              {name}
            </h4>
          </ItemTitle>
        </ItemContent>

        {/* XP */}
        <ItemContent>
          <ItemDescription className="font-semibold text-muted-foreground text-sm">
            {xp.toLocaleString()} XP
          </ItemDescription>
        </ItemContent>
      </li>
    </Item>
  );
}
