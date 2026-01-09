'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseQuizTimerOptions {
  /** Timer duration in seconds */
  duration: number;
  /** Whether timer is enabled */
  enabled: boolean;
  /** Callback when timer reaches zero */
  onTimeUp?: () => void;
  /** Whether timer is paused */
  isPaused?: boolean;
  /** Whether to track elapsed time (for challenge mode scoring) */
  trackElapsedTime?: boolean;
}

export interface UseQuizTimerReturn {
  /** Current time remaining in seconds, null if not started */
  timeRemaining: number | null;
  /** Whether timer is currently running */
  isRunning: boolean;
  /** Start the timer */
  start: () => void;
  /** Reset timer to initial duration */
  reset: () => void;
  /** Stop timer completely */
  stop: () => void;
}

/**
 * A reusable hook for countdown timer functionality.
 * Used for quiz time limits in both regular and challenge modes.
 */
export function useQuizTimer({
  duration,
  enabled,
  onTimeUp,
  isPaused = false,
  trackElapsedTime = false,
}: UseQuizTimerOptions): UseQuizTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const hasCalledTimeUpRef = useRef(false);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep onTimeUp ref updated to prevent stale closure issues
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  const isRunning = timeRemaining !== null && timeRemaining > 0 && !isPaused;

  const start = useCallback(() => {
    if (enabled) {
      setTimeRemaining(duration);
      if (trackElapsedTime) {
        setStartTime(Date.now());
      }
      hasCalledTimeUpRef.current = false;
    }
  }, [enabled, duration, trackElapsedTime]);

  const reset = useCallback(() => {
    if (enabled) {
      setTimeRemaining(duration);
      if (trackElapsedTime) {
        setStartTime(Date.now());
      }
      hasCalledTimeUpRef.current = false;
    }
  }, [enabled, duration, trackElapsedTime]);

  const stop = useCallback(() => {
    setTimeRemaining(null);
    setStartTime(null);
    hasCalledTimeUpRef.current = false;
  }, []);

  // Countdown effect
  useEffect(() => {
    if (timeRemaining === null || isPaused) return;

    if (timeRemaining <= 0) {
      // Only call onTimeUp once per timer cycle
      if (!hasCalledTimeUpRef.current) {
        hasCalledTimeUpRef.current = true;
        onTimeUpRef.current?.();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isPaused]);

  return {
    timeRemaining,
    isRunning,
    start,
    reset,
    stop,
  };
}
