'use client';

import {
  CheckCircleIcon,
  CheckIcon,
  CircleHelpIcon,
  Target,
  XCircleIcon,
  XIcon,
} from 'lucide-react';
import * as m from 'motion/react-m';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn, kebabToSnakeCase } from '@/lib/utils';

import { LETTER_TAFKHIM_GRADIENT } from '../_lib/letter';
import type { LetterTafkhimType } from '../_schemas/letter';
import type { ChallengeQuizAnalytic, QuizType } from '../_schemas/quiz';

type ChallengeAnalyticsProps = Readonly<{
  analytics: ChallengeQuizAnalytic[];
}>;

type Translator = ReturnType<typeof useTranslations>;

function getTranslatedTargetName(
  t: Translator,
  targetType: QuizType,
  slug: string,
): string {
  const keyPrefix =
    targetType === 'articulation_point'
      ? 'global.articulation_point'
      : 'global.trait';
  return t(`${keyPrefix}.${kebabToSnakeCase(slug)}`);
}

export function ChallengeAnalytics({ analytics }: ChallengeAnalyticsProps) {
  if (analytics.length === 0) return null;

  return (
    <m.div
      className="flex flex-col gap-4 p-4 pt-0"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      {analytics.map((analytic) => (
        <AnalyticCard key={analytic.questionNumber} analytic={analytic} />
      ))}
    </m.div>
  );
}

type AnalyticCardProps = Readonly<{
  analytic: ChallengeQuizAnalytic;
}>;

function AnalyticCard({ analytic }: AnalyticCardProps) {
  const t = useTranslations();
  const isPerfect = analytic.isPerfect;
  const isUnanswered = analytic.isUnanswered;
  const isMultiLetter = analytic.letters.length > 1;

  const targetTypeLabel =
    analytic.targetType === 'articulation_point'
      ? t('playground_page.quiz.challenge_analytics_type_articulation_point')
      : t('playground_page.quiz.challenge_analytics_type_trait');

  const targetName =
    isMultiLetter && analytic.correctTargets.length > 0
      ? getTranslatedTargetName(
          t,
          analytic.targetType,
          analytic.correctTargets[0].slug,
        )
      : '';

  return (
    <Card
      className={cn(
        'border-0',
        isPerfect && 'border border-green-500',
        isUnanswered && 'border border-red-500',
        !isPerfect && !isUnanswered && 'border border-yellow-500',
      )}
    >
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              'text-md h-9 w-9 shrink-0 font-semibold',
              isPerfect && 'border-green-500 text-green-500',
              isUnanswered && 'border-red-500 text-red-500',
              !isPerfect &&
                !isUnanswered &&
                'border-yellow-500 text-yellow-500',
            )}
          >
            {`#${analytic.questionNumber}`}
          </Badge>
          <span className="text-md tracking-wider text-muted-foreground uppercase">
            {targetTypeLabel}
          </span>
        </div>
        <div className="flex gap-1 text-xs font-medium text-muted-foreground">
          <span className="flex items-center justify-between gap-0.5 text-green-500">
            {analytic.correctCount} <CheckIcon className="size-3.5" />
          </span>
          <span className="flex items-center justify-between gap-0.5 text-red-500">
            {analytic.incorrectCount} <XIcon className="size-3.5" />
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-center">
          {isMultiLetter ? (
            <TargetNode
              targetType={analytic.targetType}
              targetName={targetName}
              className="rounded-lg border-2 font-semibold"
            />
          ) : (
            <LetterNode
              symbol={analytic.letters[0].symbol}
              tafkhimType={analytic.letters[0].tafkhimType}
              className="size-12 text-3xl"
            />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <TitleNode
              icon={<CircleHelpIcon className="size-4" />}
              title={t(
                'playground_page.quiz.challenge_analytics_available_answers',
              )}
            />
            <div className="flex flex-wrap gap-1">
              <AvailableOptionsList
                analytic={analytic}
                isMultiLetter={isMultiLetter}
                t={t}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <TitleNode
              icon={<CheckCircleIcon className="size-4" />}
              title={t(
                'playground_page.quiz.challenge_analytics_correct_answer',
              )}
              className="text-green-500"
            />
            <div className="flex flex-wrap gap-1">
              <CorrectAnswersList
                analytic={analytic}
                isMultiLetter={isMultiLetter}
                t={t}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <TitleNode
              icon={<Target className="size-4" />}
              title={t('playground_page.quiz.challenge_analytics_your_answer')}
            />
            <div className="flex flex-wrap gap-1">
              <UserAnswersList
                analytic={analytic}
                isMultiLetter={isMultiLetter}
                t={t}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type AnalyticSectionProps = Readonly<{
  analytic: ChallengeQuizAnalytic;
  isMultiLetter: boolean;
  t: Translator;
}>;

function AvailableOptionsList({
  analytic,
  isMultiLetter,
  t,
}: AnalyticSectionProps) {
  if (isMultiLetter) {
    return analytic.letters.map((letter) => (
      <LetterNode
        key={letter.id}
        symbol={letter.symbol}
        tafkhimType={letter.tafkhimType}
        className="size-8 text-base"
      />
    ));
  }

  return analytic.displayedTargets.map((target) => (
    <TargetNode
      key={target.id}
      targetType={analytic.targetType}
      targetName={getTranslatedTargetName(t, analytic.targetType, target.slug)}
      className="rounded-sm border"
    />
  ));
}

function CorrectAnswersList({
  analytic,
  isMultiLetter,
  t,
}: AnalyticSectionProps) {
  if (isMultiLetter && analytic.correctLetterIds) {
    return analytic.correctLetterIds.map((letterId) => {
      const letter = analytic.letters.find((l) => l.id === letterId);
      if (!letter) return null;

      return (
        <LetterNode
          key={letterId}
          symbol={letter.symbol}
          tafkhimType={letter.tafkhimType}
          className="size-8 text-base"
        />
      );
    });
  }

  return analytic.correctTargets.map((target) => (
    <TargetNode
      key={target.id}
      targetType={analytic.targetType}
      targetName={getTranslatedTargetName(t, analytic.targetType, target.slug)}
      className="rounded-sm border"
    />
  ));
}

function UserAnswersList({ analytic, isMultiLetter, t }: AnalyticSectionProps) {
  if (analytic.isUnanswered) {
    return (
      <Badge
        variant="outline"
        className="h-auto rounded-sm border border-dashed border-red-500 bg-transparent px-2! py-1! text-xs text-red-500"
      >
        {t('playground_page.quiz.challenge_analytics_unanswered')}
      </Badge>
    );
  }

  if (isMultiLetter && analytic.userSelectedLetterIds) {
    return (
      <>
        {analytic.userSelectedLetterIds.map((letterId) => {
          const isCorrect = analytic.correctLetterIds?.includes(letterId);
          const letter = analytic.letters.find((l) => l.id === letterId);
          if (!letter) return null;

          return (
            <div key={letterId} className="relative">
              <LetterNode
                symbol={letter.symbol}
                tafkhimType={letter.tafkhimType}
                className="size-8 text-base"
              />
              {isCorrect ? (
                <CheckCircleIcon className="absolute top-0 right-0 size-3 text-green-500" />
              ) : (
                <XCircleIcon className="absolute top-0 right-0 size-3 text-red-500" />
              )}
            </div>
          );
        })}
      </>
    );
  }

  return (
    <>
      {analytic.userAnswers.map((userAnswer) => {
        const isCorrect = analytic.correctTargets.some(
          (ct) => ct.id === userAnswer.id,
        );

        return (
          <div key={userAnswer.id} className="relative">
            <TargetNode
              targetType={analytic.targetType}
              targetName={getTranslatedTargetName(
                t,
                analytic.targetType,
                userAnswer.slug,
              )}
              className="rounded-sm border"
            />
            {isCorrect ? (
              <CheckCircleIcon className="absolute -top-1 -right-1 size-3 text-green-500" />
            ) : (
              <XCircleIcon className="absolute -top-1 -right-1 size-3 text-red-500" />
            )}
          </div>
        );
      })}
    </>
  );
}

type TitleNodeProps = Readonly<{
  icon: React.ReactNode;
  title: string;
  className?: string;
}>;

function TitleNode({ title, icon, className }: TitleNodeProps) {
  return (
    <h4
      className={cn(
        'flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase',
        className,
      )}
    >
      {icon}
      {title}
    </h4>
  );
}

type LetterNodeProps = Readonly<{
  symbol: string;
  tafkhimType: LetterTafkhimType;
  className?: string;
}>;

function LetterNode({ symbol, tafkhimType, className }: LetterNodeProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-arabic font-bold text-node-letter-text',
        'bg-linear-to-br',
        LETTER_TAFKHIM_GRADIENT[tafkhimType],
        className,
      )}
    >
      {symbol}
    </div>
  );
}

type TargetNodeProps = Readonly<{
  targetName: string;
  targetType: QuizType;
  className?: string;
}>;

function TargetNode({ targetName, targetType, className }: TargetNodeProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center px-2 py-1 text-center text-xs',
        targetType === 'articulation_point'
          ? 'border-node-articulation/50 bg-node-articulation-secondary text-node-articulation-text'
          : 'border-node-trait/50 bg-node-trait-secondary text-node-trait-text',
        className,
      )}
    >
      {targetName}
    </div>
  );
}
