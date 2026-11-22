'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BookmarkIcon, CheckIcon, RotateCcwIcon } from 'lucide-react';
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
import { cn } from '@/lib/utils';

import {
  getAdaptivePracticeItemsOpt,
  practiceKeys,
} from '../../_queries/practice';
import type {
  AdaptivePracticeItem,
  PracticeMode,
} from '../../_schemas/practice';
import {
  recordPracticeAttempt,
  toggleSavedItem,
} from '../../_services/practice';

interface PracticeSessionDialogProps {
  mode: PracticeMode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PracticeSessionDialog({
  mode,
  open,
  onOpenChange,
}: Readonly<PracticeSessionDialogProps>) {
  const t = useTranslations('practice_page');
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedOverrides, setSavedOverrides] = useState<Record<string, boolean>>(
    {},
  );

  const modeId = open && mode ? mode.id : '';
  const { data: items = [], isPending } = useQuery(
    getAdaptivePracticeItemsOpt(modeId),
  );

  const safeIndex = items.length > 0 ? currentIndex % items.length : 0;
  const currentItem: AdaptivePracticeItem | undefined = items[safeIndex];
  const itemKey = currentItem
    ? `${currentItem.targetType}:${currentItem.targetSlug}`
    : '';
  const isSaved = currentItem
    ? (savedOverrides[itemKey] ?? currentItem.isSaved)
    : false;

  async function handleAttempt(isCorrect: boolean) {
    if (!currentItem) return;
    await recordPracticeAttempt({
      targetType: currentItem.targetType,
      targetSlug: currentItem.targetSlug,
      isCorrect,
    });
    await queryClient.invalidateQueries({ queryKey: practiceKeys.sections() });
    setCurrentIndex((prev) => prev + 1);
  }

  async function handleToggleSave() {
    if (!currentItem) return;
    const res = await toggleSavedItem({
      targetType: currentItem.targetType,
      targetSlug: currentItem.targetSlug,
    });
    if (res.ok) {
      setSavedOverrides((prev) => ({ ...prev, [itemKey]: res.isSaved }));
      await queryClient.invalidateQueries({
        queryKey: practiceKeys.sections(),
      });
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setCurrentIndex(0);
      setSavedOverrides({});
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode ? t(mode.titleKey) : ''}</DialogTitle>
          <DialogDescription>
            {mode ? t(mode.descriptionKey) : ''}
          </DialogDescription>
        </DialogHeader>

        {isPending && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        )}

        {!isPending && items.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No items available for this practice mode yet.
          </div>
        )}

        {!isPending && currentItem && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="secondary">
                {safeIndex + 1} / {items.length}
              </Badge>
              <div className="flex items-center gap-2">
                {currentItem.mistakeCount > 0 && (
                  <Badge variant="outline">
                    {currentItem.mistakeCount}x review
                  </Badge>
                )}
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => void handleToggleSave()}
                  aria-label="Toggle bookmark"
                >
                  <BookmarkIcon
                    className={cn(
                      'size-4',
                      isSaved && 'fill-amber-400 text-amber-500',
                    )}
                  />
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 rounded-xl border bg-muted/30 p-6 text-center">
              {currentItem.arabicText && (
                <p
                  lang="ar"
                  dir="rtl"
                  className="font-arabic text-3xl leading-loose font-bold"
                >
                  {currentItem.arabicText}
                </p>
              )}
              <p className="text-lg font-bold">{currentItem.title}</p>
              <p className="text-sm text-muted-foreground">
                {currentItem.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleAttempt(false)}
              >
                <RotateCcwIcon className="size-4" />
                Needs Review
              </Button>
              <Button type="button" onClick={() => void handleAttempt(true)}>
                <CheckIcon className="size-4" />
                Got It
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
