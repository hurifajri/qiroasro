'use client';

import { useEffect, useState } from 'react';

import type { Letter } from '../schemas/letter';

type UseTajweedLetterCycleOptions = Readonly<{
  intervalMs?: number;
  isEnabled?: boolean;
}>;

const DEFAULT_INTERVAL_MS = 2200;

/**
 * Cycles sequentially once through the provided letters (`0 -> length - 1`)
 * and returns `null` after completing the full pass.
 */
export function useTajweedLetterCycle(
  letters: readonly Letter[],
  options: UseTajweedLetterCycleOptions = {},
): number | null {
  const { intervalMs = DEFAULT_INTERVAL_MS, isEnabled = true } = options;
  const [activeIndex, setActiveIndex] = useState(0);

  const isCycleComplete = letters.length > 0 && activeIndex >= letters.length;

  useEffect(() => {
    if (!isEnabled || letters.length === 0 || isCycleComplete) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const interval = setInterval(() => {
      if (!document.hidden) {
        setActiveIndex((prev) => (prev < letters.length ? prev + 1 : prev));
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isEnabled, letters.length, isCycleComplete, intervalMs]);

  if (!isEnabled || letters.length === 0 || isCycleComplete) {
    return null;
  }

  return letters[activeIndex]?.id ?? null;
}
