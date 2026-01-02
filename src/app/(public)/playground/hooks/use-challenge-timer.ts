'use client';

import { useCallback, useEffect, useState } from 'react';

export interface UseChallengeTimerOptions {
  /** Timer duration in seconds */
  duration: number;
  /** Whether timer is enabled */
  enabled: boolean;
  /** Callback when timer reaches zero - auto-advance to next question */
  onTimeUp: () => void;
  /** Whether timer is paused */
  isPaused?: boolean;
}

export interface UseChallengeTimerReturn {
  /** Current time remaining in seconds, null if not started */
  timeRemaining: number | null;
  /** Whether timer is currently running */
  isRunning: boolean;
  /** Start the timer */
  start: () => void;
  /** Reset timer to initial duration and restart */
  reset: () => void;
  /** Stop timer completely */
  stop: () => void;
  /** Get elapsed time in milliseconds since start */
  getElapsedTime: () => number;
}

/**
 * Hook for challenge timer with auto-advance on timeout.
 * Similar to useQuizTimer but optimized for challenge mode.
 */
export function useChallengeTimer({
  duration,
  enabled,
  onTimeUp,
  isPaused = false,
}: UseChallengeTimerOptions): UseChallengeTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const isRunning = timeRemaining !== null && timeRemaining > 0 && !isPaused;

  const start = useCallback(() => {
    if (enabled) {
      setTimeRemaining(duration);
      setStartTime(Date.now());
    }
  }, [enabled, duration]);

  const reset = useCallback(() => {
    if (enabled) {
      setTimeRemaining(duration);
      setStartTime(Date.now());
    }
  }, [enabled, duration]);

  const stop = useCallback(() => {
    setTimeRemaining(null);
    setStartTime(null);
  }, []);

  const getElapsedTime = useCallback(() => {
    if (!startTime) return 0;
    return Date.now() - startTime;
  }, [startTime]);

  // Countdown effect
  useEffect(() => {
    if (timeRemaining === null || isPaused) return;

    if (timeRemaining <= 0) {
      onTimeUp();
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
    getElapsedTime,
  };
}
