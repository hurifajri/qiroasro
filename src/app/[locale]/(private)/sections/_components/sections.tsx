'use client';

import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MOCK_SECTIONS } from '../_lib/mock-data';
import type { Section } from '../_schemas/sections';
import { SectionsList } from './section-list';

/**
 * Main Sections component - shows all curriculum sections with progress.
 */
export function Sections() {
  const t = useTranslations('sections_page');
  const router = useRouter();

  function handleBack() {
    router.push('/learn');
  }

  function handleContinue(section: Section) {
    // Navigate to learning path (filtered by section)
    router.push(`/learn?section=${section.id}`);
  }

  function handleReview(section: Section) {
    // Navigate to review/practice for completed section
    router.push(`/learn?section=${section.id}&mode=review`);
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col items-start gap-2">
        <h2 className="sr-only">{t('section_list_title')}</h2>
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeftIcon className="size-5" /> {t('back')}
        </Button>
        <Separator />
      </header>
      <SectionsList
        sections={MOCK_SECTIONS}
        onContinue={handleContinue}
        onReview={handleReview}
      />
    </div>
  );
}
