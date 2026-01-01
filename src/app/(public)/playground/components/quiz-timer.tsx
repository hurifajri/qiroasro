'use client';

import { TimerIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuizTimerProps {
  /** Time remaining in seconds */
  timeRemaining: number;
  /** Warning threshold - show yellow color when time is at or below this (default: 10) */
  warningThreshold?: number;
  /** Critical threshold - show red color with animation when time is at or below this (default: 5) */
  criticalThreshold?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * A reusable countdown timer display component.
 * Shows time remaining with color-coded urgency indicators.
 */
export function QuizTimer({
  timeRemaining,
  warningThreshold = 10,
  criticalThreshold = 5,
  className,
}: QuizTimerProps) {
  const getTimerStyles = () => {
    if (timeRemaining <= criticalThreshold) {
      return 'animate-pulse border-destructive bg-destructive/10 text-destructive';
    }
    if (timeRemaining <= warningThreshold) {
      return 'border-yellow-500 bg-yellow-500/10 text-yellow-500';
    }
    return 'bg-muted/50 text-muted-foreground';
  };

  return (
    <div
      className={cn(
        'flex w-20 items-center gap-2 self-center rounded-full border px-4 py-1.5 font-medium text-sm',
        getTimerStyles(),
        className,
      )}
    >
      <TimerIcon className="size-4 shrink-0" />
      <span>{timeRemaining}s</span>
    </div>
  );
}
