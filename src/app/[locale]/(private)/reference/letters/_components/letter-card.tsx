'use client';

import { CheckIcon, LockIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn, kebabToSnakeCase } from '@/lib/utils';

import type { Letter } from '../../../_schemas/reference';

interface LetterCardProps {
  letter: Letter;
}

export function LetterCard({ letter }: Readonly<LetterCardProps>) {
  const t = useTranslations('reference_letters_page');
  const tGlobal = useTranslations('global');
  const [isOpen, setIsOpen] = useState(false);

  const {
    symbol,
    nameKey,
    status,
    pointSlug,
    traitSlugs,
    examples,
    citations,
  } = letter;
  const isLearned = status === 'learned';
  const isAvailable = status === 'available';
  const isLocked = status === 'locked';

  const pointKey = kebabToSnakeCase(pointSlug);
  const pointLabel = pointSlug ? tGlobal(`articulation_point.${pointKey}`) : '';
  const pointDescription = pointSlug
    ? tGlobal(`articulation_point_description.${pointKey}`)
    : '';

  return (
    <>
      <Button
        onClick={!isLocked ? () => setIsOpen(true) : undefined}
        disabled={isLocked}
        className={cn(
          'group relative flex h-full w-full flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all',
          isLearned &&
            'border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20',
          isAvailable && 'border-primary/50 bg-primary/10 hover:bg-primary/20',
          isLocked && 'cursor-not-allowed border-muted bg-muted/30 opacity-50',
        )}
      >
        {/* Status indicator */}
        {isLearned && (
          <div className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500">
            <CheckIcon className="size-3 text-white" />
          </div>
        )}
        {isLocked && (
          <LockIcon className="absolute top-1 right-1 size-4 text-muted-foreground" />
        )}

        {/* Letter symbol */}
        <span
          className={cn(
            'font-arabic text-3xl font-bold',
            isLearned && 'text-emerald-600 dark:text-emerald-400',
            isAvailable && 'text-primary',
            isLocked && 'text-muted-foreground',
          )}
        >
          {symbol}
        </span>

        {/* Letter name */}
        <p className="text-xs font-bold">{t(nameKey)}</p>
      </Button>

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-h-[85dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <span className="font-arabic text-3xl font-bold text-primary">
                  {symbol}
                </span>
                <span>{t(nameKey)}</span>
              </DialogTitle>
              <DialogDescription>{pointLabel}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              {pointDescription && (
                <p className="text-sm text-muted-foreground">
                  {pointDescription}
                </p>
              )}

              {traitSlugs.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {traitSlugs.map((traitSlug) => (
                    <Badge key={traitSlug} variant="secondary">
                      {tGlobal(`trait.${kebabToSnakeCase(traitSlug)}`)}
                    </Badge>
                  ))}
                </div>
              )}

              {examples.length > 0 && (
                <div className="flex flex-col gap-2">
                  {examples.map((example) => (
                    <div
                      key={example.id}
                      className="flex items-center justify-between gap-2 rounded-lg border bg-muted/30 px-3 py-2"
                    >
                      <Badge variant="outline" className="font-mono text-xs">
                        {example.surahNumber}:{example.ayahNumber}
                      </Badge>
                      <p
                        lang="ar"
                        dir="rtl"
                        className="text-end font-arabic text-lg leading-loose"
                      >
                        {example.arabicText}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {citations.length > 0 && (
                <div className="flex flex-col gap-2">
                  {citations.map((citation) => (
                    <div
                      key={citation.id}
                      className="flex flex-col gap-1 rounded-lg border bg-card p-3"
                    >
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="capitalize">
                          {citation.sourceSlug.replaceAll('-', ' ')}
                        </span>
                        <span>
                          {citation.verseEnd
                            ? `${citation.verseStart}-${citation.verseEnd}`
                            : citation.verseStart}
                        </span>
                      </div>
                      {citation.verses.map((verse) => (
                        <p
                          key={verse.verseNumber}
                          lang="ar"
                          dir="rtl"
                          className="text-end font-arabic text-base leading-loose"
                        >
                          {verse.arabicText}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
