import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import type { Achievement } from '../_schemas/profile';

interface AchievementItemProps {
  achievement: Achievement;
}

export function AchievementItem({ achievement }: AchievementItemProps) {
  const t = useTranslations('profile_page');

  return (
    <Item variant="outline" asChild>
      <li className="rounded-2xl! border-2 p-4!">
        {/* Icon */}
        <ItemMedia>
          <div
            className={cn(
              'flex size-16 items-center justify-center rounded-xl',
              achievement.iconBg,
            )}
          >
            <span className="text-3xl">{achievement.iconEmoji}</span>
          </div>
        </ItemMedia>

        {/* Content */}
        <ItemContent className="gap-2">
          <ItemTitle className="flex items-center gap-2">
            <h3 className="font-bold text-base">{t(achievement.titleKey)}</h3>
            <Badge
              variant="secondary"
              className="shrink-0 font-semibold text-xs"
            >
              LEVEL {achievement.level}
            </Badge>
          </ItemTitle>
          <p className="text-muted-foreground text-sm">
            {t(achievement.descriptionKey)}
          </p>
        </ItemContent>
      </li>
    </Item>
  );
}
