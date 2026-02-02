import {
  BookOpenIcon,
  CheckCircleIcon,
  FlameIcon,
  ZapIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { cn } from '@/lib/utils';
import type { Quest } from '../_schemas/private';

interface QuestRowProps {
  quest: Quest;
}

export function QuestRow({ quest }: QuestRowProps) {
  const t = useTranslations('global.private_layout');
  const progress = Math.min((quest.current / quest.target) * 100, 100);

  // Icon based on quest type
  const getIcon = () => {
    switch (quest.iconType) {
      case 'xp':
        return <ZapIcon className="size-6 fill-amber-400 text-amber-500" />;
      case 'accuracy':
        return <CheckCircleIcon className="size-6 text-emerald-500" />;
      case 'streak':
        return <FlameIcon className="size-6 fill-orange-500 text-orange-600" />;
      case 'lessons':
        return <BookOpenIcon className="size-6 text-sky-500" />;
      default:
        return <ZapIcon className="size-6 text-primary" />;
    }
  };

  return (
    <Item asChild>
      <li className="px-0! py-0!">
        <ItemMedia
          variant="icon"
          className="translate-0! flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted"
        >
          {getIcon()}
        </ItemMedia>
        <ItemContent>
          <ItemTitle>
            <h4 className="font-medium text-sm">{t(quest.titleKey)}</h4>
          </ItemTitle>
          <ItemDescription className="flex items-center gap-2">
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <span
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  quest.completed
                    ? 'bg-emerald-500'
                    : 'bg-linear-to-r from-amber-400 to-amber-500',
                )}
                style={{ width: `${progress}%` }}
              />
            </span>
            <span className="font-medium text-muted-foreground text-xs">
              {quest.current} / {quest.target}
            </span>
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="default"
            size="icon"
            className="flex items-center justify-center rounded bg-amber-100 dark:bg-amber-900/30"
          >
            <span className="text-lg">🎁</span>
          </Button>
        </ItemActions>
      </li>
    </Item>
  );
}
