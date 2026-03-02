import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { getEmojiColorClass } from '@/lib/colors';
import { cn } from '@/lib/utils';
import type { Achievement } from '../../../_schemas/achievement';

interface AchievementItemProps {
  achievement: Achievement;
}

export function AchievementItem({ achievement }: AchievementItemProps) {
  const t = useTranslations('global.achievements');

  return (
    <Item variant="outline" asChild>
      <li>
        {/* Icon */}
        <ItemMedia>
          <div
            className={cn(
              'flex size-16 items-center justify-center rounded-xl',
              getEmojiColorClass(achievement.emojiColorCode),
            )}
          >
            <span className="text-3xl">{achievement.emoji}</span>
          </div>
        </ItemMedia>

        {/* Content */}
        <ItemContent className="gap-2">
          <ItemTitle className="flex items-center gap-2 font-bold text-base">
            {t(achievement.titleKey)}
            <Badge
              variant="secondary"
              className="shrink-0 font-semibold uppercase"
            >
              {t('level')} {achievement.level}
            </Badge>
          </ItemTitle>
          <p className="text-muted-foreground">
            {t(achievement.descriptionKey)}
          </p>
        </ItemContent>
      </li>
    </Item>
  );
}
