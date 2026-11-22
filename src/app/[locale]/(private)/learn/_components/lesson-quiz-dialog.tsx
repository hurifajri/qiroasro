'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BookmarkIcon, CheckCircle2Icon, XCircleIcon } from 'lucide-react';
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
import { gamificationKeys } from '@/features/gamification/queries/gamification';
import { cn } from '@/lib/utils';

import { curriculumKeys } from '../../_queries/curriculum-progress';
import { getUnitQuizQuestionsOpt, practiceKeys } from '../../_queries/practice';
import type { QuizSessionQuestion } from '../../_schemas/practice';
import { completeLessonAction } from '../../_services/curriculum-progress';
import {
  recordPracticeAttempt,
  toggleSavedItem,
} from '../../_services/practice';

interface LessonQuizDialogProps {
  topicSlug: string;
  unitSlug: string;
  lessonOrder: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LessonQuizDialog({
  topicSlug,
  unitSlug,
  lessonOrder,
  open,
  onOpenChange,
}: Readonly<LessonQuizDialogProps>) {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [savedOverrides, setSavedOverrides] = useState<Record<string, boolean>>(
    {},
  );

  const { data: questions = [], isPending } = useQuery(
    getUnitQuizQuestionsOpt(open ? topicSlug : '', open ? unitSlug : ''),
  );

  const currentQuestion: QuizSessionQuestion | undefined =
    questions[currentIndex];
  const isSaved = currentQuestion
    ? (savedOverrides[currentQuestion.slug] ?? currentQuestion.isSaved)
    : false;

  function resolveText(key?: string, fallback?: string): string {
    if (key && t.has(key)) return t(key);
    return fallback ?? key ?? '';
  }

  async function handleCheckAnswer() {
    if (!currentQuestion || !selectedChoiceId) return;

    const chosen = currentQuestion.choices.find(
      (c) => c.id === selectedChoiceId,
    );
    const isCorrect = chosen?.isCorrect ?? false;

    setIsSubmitted(true);
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

    await recordPracticeAttempt({
      targetType: 'question',
      targetSlug: currentQuestion.slug,
      isCorrect,
    });
  }

  async function handleNext() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoiceId(null);
      setIsSubmitted(false);
      return;
    }

    const score =
      questions.length > 0
        ? Math.round((correctCount / questions.length) * 100)
        : 100;

    await completeLessonAction(topicSlug, unitSlug, lessonOrder, score);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: curriculumKeys.all }),
      queryClient.invalidateQueries({ queryKey: gamificationKeys.all }),
      queryClient.invalidateQueries({ queryKey: practiceKeys.sections() }),
    ]);
    setIsCompleted(true);
  }

  async function handleToggleSave() {
    if (!currentQuestion) return;
    const res = await toggleSavedItem({
      targetType: 'question',
      targetSlug: currentQuestion.slug,
    });
    if (res.ok) {
      setSavedOverrides((prev) => ({
        ...prev,
        [currentQuestion.slug]: res.isSaved,
      }));
      await queryClient.invalidateQueries({
        queryKey: practiceKeys.sections(),
      });
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setCurrentIndex(0);
      setSelectedChoiceId(null);
      setIsSubmitted(false);
      setCorrectCount(0);
      setIsCompleted(false);
      setSavedOverrides({});
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {unitSlug.replaceAll('-', ' ')}
          </DialogTitle>
          <DialogDescription>
            {isCompleted
              ? 'Lesson completed!'
              : `Question ${Math.min(currentIndex + 1, Math.max(questions.length, 1))} of ${Math.max(questions.length, 1)}`}
          </DialogDescription>
        </DialogHeader>

        {isPending && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading questions...
          </div>
        )}

        {!isPending && questions.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No questions available for this lesson yet.
          </div>
        )}

        {!isPending && isCompleted && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle2Icon className="size-12 text-emerald-500" />
            <p className="text-xl font-bold">
              Score:{' '}
              {questions.length > 0
                ? Math.round((correctCount / questions.length) * 100)
                : 100}
              %
            </p>
            <Button type="button" onClick={() => handleOpenChange(false)}>
              Continue
            </Button>
          </div>
        )}

        {!isPending && !isCompleted && currentQuestion && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="secondary">
                {currentIndex + 1} / {questions.length}
              </Badge>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() => void handleToggleSave()}
                aria-label="Bookmark question"
              >
                <BookmarkIcon
                  className={cn(
                    'size-4',
                    isSaved && 'fill-amber-400 text-amber-500',
                  )}
                />
              </Button>
            </div>

            {currentQuestion.arabicFocus && (
              <p
                lang="ar"
                dir="rtl"
                className="rounded-xl border bg-muted/30 p-4 text-center font-arabic text-3xl leading-loose font-bold"
              >
                {currentQuestion.arabicFocus}
              </p>
            )}

            <p className="text-base font-semibold">
              {resolveText(
                currentQuestion.promptKey,
                currentQuestion.promptText,
              )}
            </p>

            <div className="flex flex-col gap-2">
              {currentQuestion.choices.map((choice) => {
                const isSelected = selectedChoiceId === choice.id;
                const showCorrect = isSubmitted && choice.isCorrect;
                const showIncorrect =
                  isSubmitted && isSelected && !choice.isCorrect;

                return (
                  <Button
                    key={choice.id}
                    type="button"
                    variant="outline"
                    disabled={isSubmitted}
                    onClick={() => setSelectedChoiceId(choice.id)}
                    className={cn(
                      'h-auto justify-between px-4 py-3 text-left whitespace-normal',
                      isSelected &&
                        !isSubmitted &&
                        'border-primary bg-primary/10',
                      showCorrect &&
                        'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
                      showIncorrect &&
                        'border-destructive bg-destructive/10 text-destructive',
                    )}
                  >
                    <span>
                      {resolveText(choice.labelKey, choice.labelText)}
                    </span>
                    {showCorrect && (
                      <CheckCircle2Icon className="size-4 shrink-0" />
                    )}
                    {showIncorrect && (
                      <XCircleIcon className="size-4 shrink-0" />
                    )}
                  </Button>
                );
              })}
            </div>

            {!isSubmitted ? (
              <Button
                type="button"
                disabled={!selectedChoiceId}
                onClick={() => void handleCheckAnswer()}
              >
                Check Answer
              </Button>
            ) : (
              <Button type="button" onClick={() => void handleNext()}>
                {currentIndex + 1 < questions.length ? 'Next' : 'Finish'}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
