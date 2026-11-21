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
}

export interface UseQuizTimerReturn {
  /** Current time remaining in seconds, null if not started */
  timeRemaining: number | null;
  /** Start the timer */
  start: () => void;
  /** Reset timer to initial duration */
  reset: () => void;
  /** Stop timer completely */
  stop: () => void;
}

/**
 * A reusable hook for countdown timer functionality.
 * Used for quiz time limits in both practice and challenge modes.
 */
export function useQuizTimer({
  duration,
  enabled,
  onTimeUp,
  isPaused = false,
}: UseQuizTimerOptions): UseQuizTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const hasCalledTimeUpRef = useRef(false);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep onTimeUp ref updated to prevent stale closure issues
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  const start = useCallback(() => {
    if (!enabled) return;

    setTimeRemaining(duration);
    hasCalledTimeUpRef.current = false;
  }, [duration, enabled]);

  const reset = useCallback(() => {
    if (!enabled) return;

    setTimeRemaining(duration);
    hasCalledTimeUpRef.current = false;
  }, [duration, enabled]);

  const stop = useCallback(() => {
    setTimeRemaining(null);
    hasCalledTimeUpRef.current = false;
  }, []);

  const isRunning = timeRemaining !== null && timeRemaining > 0 && !isPaused;

  // Countdown interval effect (runs stably without recreating every second)
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  // Trigger onTimeUp once when countdown reaches zero
  useEffect(() => {
    if (timeRemaining === 0 && !hasCalledTimeUpRef.current) {
      hasCalledTimeUpRef.current = true;
      onTimeUpRef.current?.();
    }
  }, [timeRemaining]);

  return {
    start,
    stop,
    reset,
    timeRemaining,
  };
}
