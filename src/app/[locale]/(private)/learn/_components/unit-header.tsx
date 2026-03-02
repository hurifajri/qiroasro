'use client';

import { ArrowLeftIcon, BookOpenIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import { getCardColorClass } from '@/lib/colors';
import { cn } from '@/lib/utils';
import type { Unit } from '../_schemas/learn';

interface UnitHeaderProps {
  unit: Unit;
  sectionTitle: string;
  onClickSection: (unit: Unit) => void;
  onClickGuidebook: () => void;
}

/**
 * Sticky unit header like Duolingo's section headers.
 * Shows section info, unit title, and guidebook button.
 */
export function UnitHeader({
  unit,
  sectionTitle,
  onClickSection,
  onClickGuidebook,
}: UnitHeaderProps) {
  const t = useTranslations('learn_page');

  return (
    <Item
      variant="muted"
      className={cn(
        'sticky top-20 z-10 rounded-xl p-4 md:top-6',
        getCardColorClass(unit.colorCode),
      )}
    >
      <ItemContent>
        <ItemTitle
          onClick={() => onClickSection(unit)}
          className="cursor-default"
        >
          <ArrowLeftIcon className="size-5" />
          <h3 className="font-bold text-white uppercase tracking-wider">
            {sectionTitle}
          </h3>
        </ItemTitle>
        <ItemDescription className="font-bold text-lg text-white leading-tight">
          {t(unit.titleKey)}
        </ItemDescription>
      </ItemContent>
      {onClickGuidebook && (
        <ItemActions>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClickGuidebook}
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
