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

import { SuperBadge } from '../../_components/super-badge';
import type { PracticeMode } from '../../_schemas/practice';

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
  onSelectMode: (mode: PracticeMode) => void;
}

export function PracticeItem({
  mode,
  onSelectMode,
}: Readonly<PracticeItemProps>) {
  const t = useTranslations('practice_page');
  const Icon = iconMap[mode.iconName];
  const colors = getPracticeColors(mode.colorCode);

  return (
    <Item variant="outline" asChild>
      <li
        onClick={() => onSelectMode(mode)}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            onSelectMode(mode);
          }
        }}
        className={cn(
          'relative flex w-full cursor-pointer items-center gap-4 rounded-2xl! border-2 p-4! text-left transition-all',
          colors.card,
        )}
      >
        <ItemContent>
          <ItemTitle>
            <h4 className="font-bold">{t(mode.titleKey)}</h4>
            {mode.isPremium && <SuperBadge />}
          </ItemTitle>
          <ItemDescription>{t(mode.descriptionKey)}</ItemDescription>
        </ItemContent>
        <ItemMedia
          variant="icon"
          className="relative translate-0! self-center!"
        >
          <Icon className={cn('size-12', colors.icon)} />
          {mode.badge && (
            <span className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
              {mode.badge > 99 ? '99+' : mode.badge}
            </span>
          )}
        </ItemMedia>
      </li>
    </Item>
  );
}
