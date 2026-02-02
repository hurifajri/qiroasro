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
import type { ChallengeQuizAnalytic, QuizType } from '../_schemas/quiz';

interface ChallengeAnalyticsProps {
  analytics: ChallengeQuizAnalytic[];
}

export function ChallengeAnalytics({ analytics }: ChallengeAnalyticsProps) {
  const t = useTranslations();

  if (analytics.length === 0) return null;

  return (
    <m.div
      className="flex flex-col gap-4 p-4 pt-0"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      {analytics.map((analytic) => {
        // Determine card color based on status
        const isPerfect = analytic.isPerfect;
        const isUnanswered = analytic.isUnanswered;

        // Detect multi-letter scenario (5 letters, 1 target)
        const isMultiLetter = analytic.letters.length > 1;

        // Get target type label
        const targetTypeLabel =
          analytic.targetType === 'articulation_point'
            ? t(
                'playground_page.quiz.challenge_analytics_type_articulation_point',
              )
            : t('playground_page.quiz.challenge_analytics_type_trait');

        // Get target name for multi-letter case
        const targetName =
          isMultiLetter && analytic.correctTargets.length > 0
            ? analytic.targetType === 'articulation_point'
              ? t(
                  `global.articulation_point.${kebabToSnakeCase(analytic.correctTargets[0].slug)}`,
                )
              : t(
                  `global.trait.${kebabToSnakeCase(analytic.correctTargets[0].slug)}`,
                )
            : '';

        return (
          <Card
            key={analytic.questionNumber}
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
                    'shrink-0 py-3 font-semibold text-md',
                    isPerfect && 'border-green-500 text-green-500',
                    isUnanswered && 'border-red-500 text-red-500',
                    !isPerfect &&
                      !isUnanswered &&
                      'border-yellow-500 text-yellow-500',
                  )}
                >
                  {`#${analytic.questionNumber}`}
                </Badge>
                <span className="text-md text-muted-foreground uppercase tracking-wider">
                  {targetTypeLabel}
                </span>
              </div>
              <div className="flex flex-col gap-1 font-medium text-muted-foreground text-xs">
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
                {/* Visual Subject Representation */}
                {isMultiLetter ? (
                  // Target Visualization
                  <TargetNode
                    targetType={analytic.targetType}
                    targetName={targetName}
                    className="rounded-lg border-2 font-semibold"
                  />
                ) : (
                  // Letter Visualization
                  <LetterNode
                    symbol={analytic.letters[0].symbol}
                    isMadd={analytic.letters[0].isMadd}
                    className="size-12 text-3xl"
                  />
                )}
              </div>

              {/* Answers Grid */}
              <div className="flex flex-col gap-4">
                {/* Available Options */}
                <div className="flex flex-col gap-1">
                  <TitleNode
                    icon={<CircleHelpIcon className="size-4" />}
                    title={t(
                      'playground_page.quiz.challenge_analytics_available_answers',
                    )}
                  />
                  <div className="flex flex-wrap gap-1">
                    {isMultiLetter
                      ? analytic.letters.map((letter) => (
                          <LetterNode
                            key={letter.id}
                            symbol={letter.symbol}
                            isMadd={letter.isMadd}
                            className="size-8 text-base"
                          />
                        ))
                      : analytic.displayedTargets.map((target) => {
                          const targetName =
                            analytic.targetType === 'articulation_point'
                              ? t(
                                  `global.articulation_point.${kebabToSnakeCase(target.slug)}`,
                                )
                              : t(
                                  `global.trait.${kebabToSnakeCase(target.slug)}`,
                                );

                          return (
                            <TargetNode
                              key={target.id}
                              targetType={analytic.targetType}
                              targetName={targetName}
                              className="rounded-sm border"
                            />
                          );
                        })}
                  </div>
                </div>

                {/* Correct Answer*/}
                <div className="flex flex-col gap-1">
                  <TitleNode
                    icon={<CheckCircleIcon className="size-4" />}
                    title={t(
                      'playground_page.quiz.challenge_analytics_correct_answer',
                    )}
                    className="text-green-500"
                  />
                  <div className="flex flex-wrap gap-1">
                    {isMultiLetter && analytic.correctLetterIds
                      ? analytic.correctLetterIds.map((letterId) => {
                          const letter = analytic.letters.find(
                            (l) => l.id === letterId,
                          );

                          if (!letter) return null;

                          return (
                            <LetterNode
                              key={letterId}
                              symbol={letter.symbol}
                              isMadd={letter.isMadd}
                              className="size-8 text-base"
                            />
                          );
                        })
                      : analytic.correctTargets.map((target) => {
                          const targetName =
                            analytic.targetType === 'articulation_point'
                              ? t(
                                  `global.articulation_point.${kebabToSnakeCase(target.slug)}`,
                                )
                              : t(
                                  `global.trait.${kebabToSnakeCase(target.slug)}`,
                                );

                          return (
                            <TargetNode
                              key={target.id}
                              targetType={analytic.targetType}
                              targetName={targetName}
                              className="rounded-sm border"
                            />
                          );
                        })}
                  </div>
                </div>

                {/* Your Answer */}
                <div className="flex flex-col gap-1">
                  <TitleNode
                    icon={<Target className="size-4" />}
                    title={t(
                      'playground_page.quiz.challenge_analytics_your_answer',
                    )}
                  />
                  <div className="flex flex-wrap gap-1">
                    {isUnanswered ? (
                      <Badge
                        variant="outline"
                        className={cn(
                          'h-auto rounded-sm border border-dashed bg-transparent px-2! py-1! text-xs',
                          isUnanswered
                            ? 'border-red-500 text-red-500'
                            : 'text-muted-foreground',
                        )}
                      >
                        {t(
                          'playground_page.quiz.challenge_analytics_unanswered',
                        )}
                      </Badge>
                    ) : isMultiLetter && analytic.userSelectedLetterIds ? (
                      analytic.userSelectedLetterIds.map((letterId) => {
                        const isCorrect =
                          analytic.correctLetterIds?.includes(letterId);
                        const letter = analytic.letters.find(
                          (l) => l.id === letterId,
                        );

                        if (!letter) return null;

                        return (
                          <div key={letterId} className="relative">
                            <LetterNode
                              symbol={letter.symbol}
                              isMadd={letter.isMadd}
                              className="size-8 text-base"
                            />
                            {isCorrect ? (
                              <CheckCircleIcon className="absolute -top-1 -right-1 size-3 text-green-500" />
                            ) : (
                              <XCircleIcon className="absolute -top-1 -right-1 size-3 text-red-500" />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      analytic.userAnswers.map((userAnswer) => {
                        const isCorrect = analytic.correctTargets.some(
                          (ct) => ct.id === userAnswer.id,
                        );
                        const targetName =
                          analytic.targetType === 'articulation_point'
                            ? t(
                                `global.articulation_point.${kebabToSnakeCase(userAnswer.slug)}`,
                              )
                            : t(
                                `global.trait.${kebabToSnakeCase(userAnswer.slug)}`,
                              );

                        return (
                          <div key={userAnswer.id} className="relative">
                            <TargetNode
                              targetType={analytic.targetType}
                              targetName={targetName}
                              className="rounded-sm border"
                            />
                            {isCorrect ? (
                              <CheckCircleIcon className="absolute -top-1 -right-1 size-3 text-green-500" />
                            ) : (
                              <XCircleIcon className="absolute -top-1 -right-1 size-3 text-red-500" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </m.div>
  );
}

interface TitleNodeProps {
  icon: React.ReactNode;
  title: string;
  className?: string;
}
function TitleNode({ title, icon, className }: TitleNodeProps) {
  return (
    <h4
      className={cn(
        'flex items-center gap-1 font-medium text-muted-foreground text-xs uppercase',
        className,
      )}
    >
      {icon}
      {title}
    </h4>
  );
}

interface LetterNodeProps {
  symbol: string;
  isMadd: boolean;
  className?: string;
}

function LetterNode({ symbol, isMadd, className }: LetterNodeProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-arabic font-bold text-node-letter-text',
        isMadd
          ? 'bg-linear-to-br from-node-letter-madd to-node-letter-madd-dark'
          : 'bg-linear-to-br from-node-letter to-node-letter-dark',
        className,
      )}
    >
      {symbol}
    </div>
  );
}

interface TargetNodeProps {
  targetName: string;
  targetType: QuizType;
  className?: string;
}

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
