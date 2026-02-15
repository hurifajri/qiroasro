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
  const { rank, name, xp, isCurrentUser, avatarUrl, avatarBg } = entry;

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
        <ItemMedia variant="icon">
          <div
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-full font-bold text-sm',
              getMedalStyle(),
            )}
          >
            {rank}
          </div>
        </ItemMedia>

        {/* Name */}
        <ItemContent>
          <ItemTitle
            className={cn(
              'truncate',
              isCurrentUser && 'font-bold text-primary',
            )}
          >
            {name}
          </ItemTitle>
        </ItemContent>

        {/* XP */}
        <ItemContent>
          <ItemDescription>{xp.toLocaleString()} XP</ItemDescription>
        </ItemContent>
      </li>
    </Item>
  );
}
