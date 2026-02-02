import { CheckCircleIcon, LockIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item';
import { cn } from '@/lib/utils';
import type { Section } from '../_schemas/sections';

interface SectionItemProps {
  section: Section;
  onContinue: (section: Section) => void;
  onReview: (section: Section) => void;
}

export function SectionItem({
  section,
  onContinue,
  onReview,
}: SectionItemProps) {
  const t = useTranslations('sections_page');
  const { status, progress, number: sectionNumber } = section;

  const isCompleted = status === 'completed';
  const isInProgress = status === 'in-progress';
  const isLocked = status === 'locked';

  // Color variants
  const colorVariants: Record<string, string> = {
    rose: 'bg-rose-500',
    orange: 'bg-orange-500',
    amber: 'bg-amber-500',
    yellow: 'bg-yellow-500',
    lime: 'bg-lime-500',
    green: 'bg-green-500',
    emerald: 'bg-emerald-500',
    teal: 'bg-teal-500',
    cyan: 'bg-cyan-500',
    sky: 'bg-sky-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  const progressColor = isCompleted
    ? 'bg-emerald-500'
    : isLocked
      ? 'bg-muted-foreground/30'
      : (colorVariants[section.color] ?? 'bg-primary');

  return (
    <Item variant="outline" asChild>
      <li
        className={cn(
          'gap-1! rounded-2xl! border-2 p-4! transition-all',
          isInProgress && 'border-primary bg-card shadow-lg',
          isCompleted && 'border-border bg-card/50',
          isLocked && 'border-muted bg-muted/30',
        )}
      >
        <ItemHeader>
          <ItemTitle>
            <h3 className="font-bold text-lg">
              {t('section_title', { number: sectionNumber })}
            </h3>
          </ItemTitle>
        </ItemHeader>
        <ItemContent>
          {/* Progress Bar */}
          <div className="flex flex-1 items-center gap-2">
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  progressColor,
                )}
                style={{ width: `${Math.max(progress, 0)}%` }}
              />
            </div>
            <span className="w-8.25 shrink-0 text-right font-medium text-muted-foreground text-sm">
              {progress}%
            </span>
          </div>
        </ItemContent>
        <ItemActions className="flex w-24 shrink-0 items-center justify-center">
          {isLocked && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => onContinue(section)}
              className="w-full"
              disabled
            >
              <LockIcon className="size-6 text-muted-foreground" />
            </Button>
          )}

          {isInProgress && (
            <Button
              size="lg"
              onClick={() => onContinue(section)}
              className="w-full font-semibold"
            >
              {t('continue')}
            </Button>
          )}

          {isCompleted && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => onReview(section)}
              className="w-full font-semibold"
            >
              {t('review')}
            </Button>
          )}
        </ItemActions>
        <ItemFooter>
          {/* Description for in-progress section */}
          {(isLocked || isInProgress) && (
            <p className="text-muted-foreground text-sm">
              {t(section.descriptionKey)}
            </p>
          )}

          {/* Completion Status */}
          {isCompleted && (
            <div className="flex items-center gap-1.5 text-emerald-600 text-sm dark:text-emerald-400">
              <CheckCircleIcon className="size-4" />
              <span>{t('completed')}</span>
            </div>
          )}
        </ItemFooter>
      </li>
    </Item>
  );
}
