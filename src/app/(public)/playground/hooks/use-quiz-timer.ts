'use client';

import { useCallback, useEffect, useState } from 'react';

export interface UseQuizTimerOptions {
  /** Initial duration in seconds */
  duration: number;
  /** Whether timer mode is enabled */
  enabled: boolean;
  /** Callback when timer reaches zero */
  onTimeUp?: () => void;
  /** Whether timer should be paused */
  isPaused?: boolean;
}

export interface UseQuizTimerReturn {
  /** Current time remaining in seconds, null if timer not started */
  timeRemaining: number | null;
  /** Whether timer is currently running */
  isRunning: boolean;
  /** Start the timer */
  start: () => void;
  /** Reset the timer to initial duration */
  reset: () => void;
  /** Stop and clear the timer */
  stop: () => void;
}

/**
 * A reusable hook for countdown timer functionality.
 * Used for quiz time limits and other timed features.
 */
export function useQuizTimer({
  duration,
  enabled,
  onTimeUp,
  isPaused = false,
}: UseQuizTimerOptions): UseQuizTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const isRunning = timeRemaining !== null && timeRemaining > 0 && !isPaused;

  const start = useCallback(() => {
    if (enabled) {
      setTimeRemaining(duration);
    }
  }, [enabled, duration]);

  const reset = useCallback(() => {
    if (enabled) {
      setTimeRemaining(duration);
    }
  }, [enabled, duration]);

  const stop = useCallback(() => {
    setTimeRemaining(null);
  }, []);

  // Handle countdown
  useEffect(() => {
    if (timeRemaining === null || isPaused) return;

    if (timeRemaining <= 0) {
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isPaused, onTimeUp]);

  return {
    timeRemaining,
    isRunning,
    start,
    reset,
    stop,
  };
}
