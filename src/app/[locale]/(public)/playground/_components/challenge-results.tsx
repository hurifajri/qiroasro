'use client';

import { useRef } from 'react';
import { calculateAccuracy } from '../_lib/challenge-results';
import type { ChallengeQuizResult } from '../_schemas/quiz';
import { ChallengeActions } from './challenge-actions';
import { ChallengeAnalytics } from './challenge-analytics';
import { ChallengeBadge } from './challenge-badge';
import { ChallengeConfetti } from './challenge-confetti';
import { ChallengeStats } from './challenge-stats';

interface ChallengeResultsProps {
  result: ChallengeQuizResult;
  onPlayAgain: () => void;
  onChangeMode: () => void;
}

export function ChallengeResults({
  result,
  onPlayAgain,
  onChangeMode,
}: ChallengeResultsProps) {
  const resultRef = useRef<HTMLDivElement>(null);
  const accuracy = calculateAccuracy(
    result.score.correctConnection,
    result.totalPossibleConnection,
  );

  return (
    <>
      <ChallengeConfetti />

      <div className="h-[calc(100dvh-128px)] overflow-y-auto">
        <div className="flex flex-col overflow-y-auto bg-background">
          <div ref={resultRef} className="flex flex-col gap-4 p-4">
            <ChallengeBadge
              difficulty={result.difficulty}
              accuracy={accuracy}
            />
            <ChallengeStats result={result} accuracy={accuracy} />
          </div>
          <ChallengeAnalytics analytics={result.analytics} />
        </div>
      </div>

      <ChallengeActions
        result={result}
        resultRef={resultRef}
        onPlayAgain={onPlayAgain}
        onChangeMode={onChangeMode}
      />
    </>
  );
}
