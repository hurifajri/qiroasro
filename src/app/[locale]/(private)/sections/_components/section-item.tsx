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

  const progressColor = isCompleted
    ? 'bg-emerald-500'
    : isLocked
      ? 'bg-muted'
      : 'bg-primary';

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
            <h2 className="uppercase">
              {t('section_title', { number: sectionNumber })}
            </h2>
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
            <p className="w-8.25 shrink-0 text-right text-muted-foreground">
              {progress}%
            </p>
          </div>
        </ItemContent>
        <ItemActions className="flex w-24 shrink-0 items-center justify-center">
          {isLocked && (
            <Button
              onClick={() => onContinue(section)}
              variant="outline"
              className="w-full"
              disabled
            >
              <LockIcon className="size-4 text-muted-foreground" />
            </Button>
          )}

          {isInProgress && (
            <Button onClick={() => onContinue(section)} className="w-full">
              {t('continue')}
            </Button>
          )}

          {isCompleted && (
            <Button
              onClick={() => onReview(section)}
              variant="outline"
              className="w-full"
            >
              {t('review')}
            </Button>
          )}
        </ItemActions>
        <ItemFooter>
          {/* Description for in-progress section */}
          {(isLocked || isInProgress) && (
            <p className="text-muted-foreground">{t(section.descriptionKey)}</p>
          )}

          {/* Completion Status */}
          {isCompleted && (
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircleIcon className="size-4" />
              <p>{t('completed')}</p>
            </div>
          )}
        </ItemFooter>
      </li>
    </Item>
  );
}
