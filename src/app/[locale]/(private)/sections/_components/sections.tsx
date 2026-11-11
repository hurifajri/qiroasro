'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { ArrowLeftIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRouter } from '@/i18n/navigation';
import { getSectionsWithProgressOpt } from '../../_queries/curriculum-progress';
import type { SectionWithProgress } from '../../_schemas/curriculum-progress';
import { SectionsList } from './section-list';

/**
 * Main Sections component - shows all curriculum sections with progress.
 * Data is sourced from CURRICULUM_TOPICS merged with user DB progress.
 */
export function Sections() {
  const t = useTranslations('sections_page');
  const router = useRouter();

  const { data: sections } = useSuspenseQuery(getSectionsWithProgressOpt());
  console.log('getSectionsWithProgressOpt', sections);

  function handleBack() {
    router.push('/learn');
  }

  function handleStart(section: SectionWithProgress) {
    if (!section) return;
    router.push(`/learn?section=${section.slug}`);
  }

  function handleContinue(section: SectionWithProgress) {
    if (!section) return;
    router.push(`/learn?section=${section.slug}`);
  }

  function handleReview(section: SectionWithProgress) {
    if (!section) return;
    router.push(`/learn?section=${section.slug}&mode=review`);
  }

  return (
    <div className="@container flex flex-col gap-4">
      <div className="flex flex-col items-start gap-2">
        <Button onClick={handleBack} variant="ghost" className="cursor-pointer">
          <ArrowLeftIcon className="size-4" /> {t('back')}
        </Button>
        <Separator />
      </div>
      <SectionsList
        sections={sections}
        onStart={handleStart}
        onContinue={handleContinue}
        onReview={handleReview}
      />
    </div>
  );
}
