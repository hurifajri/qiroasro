'use client';

import { BookOpenIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import { cn } from '@/lib/utils';
import type { Unit } from '../_schemas/learn';

interface UnitHeaderProps {
  unit: Unit;
  sectionTitle: string;
  onGuidebookClick?: () => void;
}

/**
 * Sticky unit header like Duolingo's section headers.
 * Shows section info, unit title, and guidebook button.
 */
export function UnitHeader({
  unit,
  sectionTitle,
  onGuidebookClick,
}: UnitHeaderProps) {
  const t = useTranslations('learn_page');

  // Color variants based on unit color
  const colorVariants: Record<string, string> = {
    rose: 'bg-rose-600 dark:bg-rose-700',
    orange: 'bg-orange-600 dark:bg-orange-700',
    amber: 'bg-amber-600 dark:bg-amber-700',
    yellow: 'bg-yellow-600 dark:bg-yellow-700',
    lime: 'bg-lime-600 dark:bg-lime-700',
    green: 'bg-green-600 dark:bg-green-700',
    emerald: 'bg-emerald-600 dark:bg-emerald-700',
    teal: 'bg-teal-600 dark:bg-teal-700',
    cyan: 'bg-cyan-600 dark:bg-cyan-700',
    sky: 'bg-sky-600 dark:bg-sky-700',
    blue: 'bg-blue-600 dark:bg-blue-700',
  };

  const bgColor = colorVariants[unit.color] ?? 'bg-primary';

  return (
    <Item
      variant="muted"
      className={cn('sticky top-20 z-10 rounded-xl p-4 md:top-6', bgColor)}
    >
      <ItemContent>
        <ItemTitle>
          <h3 className="font-bold text-white uppercase tracking-wider">
            {sectionTitle}
          </h3>
        </ItemTitle>
        <ItemDescription className="font-bold text-lg text-white leading-tight">
          {t(unit.titleKey)}
        </ItemDescription>
      </ItemContent>
      {onGuidebookClick && (
        <ItemActions>
          <Button
            variant="secondary"
            size="sm"
            onClick={onGuidebookClick}
            className="shrink-0 bg-white/20 text-white hover:bg-white/30"
          >
            <BookOpenIcon className="size-4" />
            <span className="hidden sm:inline">{t('guidebook')}</span>
          </Button>
        </ItemActions>
      )}
    </Item>
  );
}
