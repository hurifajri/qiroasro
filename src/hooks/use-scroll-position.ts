'use client';

import { useEffect, useState } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

interface UseScrollPositionOptions {
  /**
   * Throttle delay in milliseconds
   * @default 0
   */
  throttleMs?: number;
}

/**
 * A reusable hook to track the current scroll position
 * @param options - Configuration options
 * @returns The current scroll position { x, y }
 */
export function useScrollPosition(
  options: UseScrollPositionOptions = {},
): ScrollPosition {
  const { throttleMs = 0 } = options;
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastRun = 0;

    const handleScroll = () => {
      const now = Date.now();

      if (throttleMs > 0) {
        if (now - lastRun >= throttleMs) {
          lastRun = now;
          setScrollPosition({
            x: window.scrollX,
            y: window.scrollY,
          });
        } else if (!timeoutId) {
          timeoutId = setTimeout(
            () => {
              lastRun = Date.now();
              setScrollPosition({
                x: window.scrollX,
                y: window.scrollY,
              });
              timeoutId = null;
            },
            throttleMs - (now - lastRun),
          );
        }
      } else {
        setScrollPosition({
          x: window.scrollX,
          y: window.scrollY,
        });
      }
    };

    // Set initial position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [throttleMs]);

  return scrollPosition;
}

/**
 * A convenience hook that returns whether the page is scrolled from top
 * @param threshold - The scroll threshold in pixels (default: 0)
 * @returns true if scrolled past threshold, false otherwise
 */
export function useIsScrolled(threshold = 0): boolean {
  const { y } = useScrollPosition();
  return y > threshold;
}
