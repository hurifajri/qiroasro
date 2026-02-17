import {
  BookOpenIcon,
  HeadphonesIcon,
  RefreshCwIcon,
  SpeechIcon,
  StarIcon,
  ZapIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { getPracticeColors } from '@/lib/colors';
import { cn } from '@/lib/utils';
import type { PracticeMode } from '../_lib/mock-data';

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Speech: SpeechIcon,
  Zap: ZapIcon,
  BookOpen: BookOpenIcon,
  Headphones: HeadphonesIcon,
  RefreshCw: RefreshCwIcon,
  Star: StarIcon,
};

interface PracticeItemProps {
  mode: PracticeMode;
}

export function PracticeItem({ mode }: PracticeItemProps) {
  const t = useTranslations('practice_page');
  const Icon = iconMap[mode.iconName];
  const colors = getPracticeColors(mode.colorCode);

  function handleClickMode() {
    console.log(mode);
  }

  return (
    <Item variant="outline" asChild>
      <li
        onClick={() => handleClickMode()}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleClickMode();
          }
        }}
        className={cn(
          'group relative flex w-full items-center gap-4 rounded-2xl! border-2 p-4! text-left transition-all',
          colors.card,
        )}
      >
        <ItemContent>
          <ItemTitle>
            <h4 className="font-bold text-base">{t(mode.titleKey)}</h4>
            {mode.isPremium && (
              <span className="rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 px-2 py-0.5 font-bold text-white text-xs">
                SUPER
              </span>
            )}
          </ItemTitle>
          <ItemDescription>{t(mode.descriptionKey)}</ItemDescription>
        </ItemContent>
        <ItemMedia
          variant="icon"
          className="translate-0! self-center! relative"
        >
          <Icon className={cn('size-12', colors.icon)} />
          {mode.badge && (
            <span className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-amber-500 font-bold text-white text-xs">
              {mode.badge > 99 ? '99+' : mode.badge}
            </span>
          )}
        </ItemMedia>
      </li>
    </Item>
  );
}
