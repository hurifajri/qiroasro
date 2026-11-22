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
import { useRouter } from '@/i18n/navigation';
import { getCardColorClass } from '@/lib/colors';
import { cn, spaceToKebabCase } from '@/lib/utils';

import type { CurriculumUnit } from '../../_lib/curriculum';

interface UnitHeaderProps {
  unit: CurriculumUnit;
  topicTitle: string;
  topicSlug: string;
}

/**
 * Sticky unit header like Duolingo's section headers.
 * Shows section info, unit title, and guidebook button.
 */
export function UnitHeader({
  unit,
  topicSlug,
  topicTitle,
}: Readonly<UnitHeaderProps>) {
  const t = useTranslations();
  const router = useRouter();

  function handleClickSection() {
    router.push('/sections');
  }

  function handleClickGuidebook() {
    const anchor = spaceToKebabCase(t(unit.titleKey));
    const url = `/reference/${topicSlug}#${anchor}`;
    router.push(url);
  }

  return (
    <Item
      variant="muted"
      className={cn(
        'sticky top-15.5 z-10 rounded-xl p-4 md:top-6',
        getCardColorClass(unit.colorCode),
      )}
    >
      <ItemContent>
        <ItemTitle onClick={handleClickSection} className="cursor-pointer">
          <ArrowLeftIcon className="size-4 text-white" />
          <h2 className="font-bold text-white uppercase">{topicTitle}</h2>
        </ItemTitle>
        <ItemDescription className="font-bold text-white">
          {t(unit.titleKey)}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          onClick={handleClickGuidebook}
          className="shrink-0 cursor-pointer bg-white/20 text-white hover:bg-white/30"
        >
          <BookOpenIcon className="size-4" />
          <span className="hidden sm:inline">
            {t('learn_page.read_reference')}
          </span>
        </Button>
      </ItemActions>
    </Item>
  );
}
